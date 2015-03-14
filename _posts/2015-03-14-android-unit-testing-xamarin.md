---
layout: post
title: Automating Android Unit Tests with Xamarin - Kyle Bremner | Software Engineer
item_title: Automating Android Unit Tests with Xamarin
sections:
  - Creating the Project
  - Automating the Tests
  - References
tags: android testing unit-testing xamarin
published: true
---

Recently, I've been evaluating [Xamarin's](xamarin.com) native bindings. As part of this, I started looking at how to
run unit tests on real devices automatically as part of continuous integration (CI) builds. This is fairly well documented
for iOS (see [here](http://developer.xamarin.com/guides/ios/deployment,_testing,_and_metrics/touch.unit/)). However,
there is no similar documentation for Android. This post is an attempt to fill that gap. I'll be using Xamarin
Studio on Mac, but the steps should be similar if you're using Visual Studio.

<div class="alert alert-info">
<p>
This post is about automated unit testing, as opposed to integration/acceptance testing. For details of running
UI tests as part of an acceptance testing strategy, see <a href="http://developer.xamarin.com/guides/testcloud/uitest/">
Xamarin.UITest</a>.
</p>
</div>

{% include section_header.html name="Creating the Project" %}
With Xamarin Studio open, click _File > New > Solution..._ and select **Android Unit Test Project**.
![create the project](/images/xamarin-1.png)
This will generate two source files, `MainActivity.cs` and `TestsSample.cs`. `TestsSample.cs` will look familiar if
you've written NUnit tests before - it uses annotations to mark methods as tests and includes a number of examples.
Under the covers Xamarin use NUnitLite for Android and iOS unit testing, which exposes the same annotations as NUnit
and the same basic assertions. More information about the differences between NUnit and NUnitLite can be found
[here](https://github.com/nunit/dev/wiki/NUnitLite-Unification).

With `MainActivity.cs`, there are two interesting points. Firstly, it extends `TestSuiteActivity.cs`, which handles
the execution of the tests. Secondly, the `AddTest` method is used to add tests to be executed from an assembly. The
example passes in the currently executing assembly, but the tests could come from another referenced assembly.

Running this sample will show an activity with buttons for running the tests and changing some options. After running
the tests, the results will be shown on screen.
<img src="/images/xamarin-2.png" height="500px" style="display: block;">

{% include section_header.html name="Automating the Tests" %}
We know how to run the tests manually, but how can we automate this? The documentation for unit testing on iOS points
to the [TouchRunner class](http://iosapi.xamarin.com/?link=T%3aNUnit.UI.TouchRunner). The documentation for this class
shows that it's quite simple to setup the iOS unit tests to be automated:
{% highlight c# %}
runner.Writer = new TcpTextWriter ("10.0.1.2", 16384);
// start running the test suites as soon as the application is loaded
runner.AutoStart = true;
// crash the application (to ensure it's ended) and return to springboard
runner.TerminateAfterExecution = true;
{% endhighlight %}
The `AutoStart` property of the runner is set to true to tell it to start running the tests once the configuration is
complete. Setting the `TerminateAfterExecution` property to true ensures that the application does not stay running
after the tests have been completed.

The final step is to actually get the results off of the device, which is where the `Writer` property comes in. The
runner will write basic information about the device that it is running the tests on, as well the results of the tests,
using the value of the `Writer` property. The default `Writer` writes the results to the console, but a `TcpTextWriter`
is available that can send the results to a server.

<div class="alert alert-info">
<p>
Collecting the results and dealing with them is beyond the scope of this post, but a simple TCP server can be written
in a few lines using Python that would be suitable for the job. A CI build just needs to start the server before
executing the tests, ensuring that the unit test application knows the IP address and port for the TCP server.
</p>
</div>

The approach is not quite so straight forward on Android (the lack of documentation doesn't help the matter). The first
issue is that on Android there are no similar properties. The `TestSuiteActivity` only exposes a method for adding
tests. When the application is running, we can see that there is an _Options_ button which, when pressed, shows an activity
that allows for setting the details of a remote server.
<img src="/images/xamarin-3.png" height="500px" style="display: block;">

Setting these values to point to a TCP server and running the tests shows that the device details and test results are
sent to the server. The code that is executing the tests has to be getting the host name and port somehow, so it's time
to start digging.

Right clicking `TestSuiteActivity` and clicking _Go To Declaration_ results in the class being shown in the assembly
browser. Setting language to C# in the top right-hand corner of the window shows a fairly readable version of the
implementation. From the generated `MainActiviy` class, we can see that the work to start the execution of the tests
must be happening in the `OnCreate` base method, so that seems like a good place to start:
{% highlight c# %}
protected override void OnCreate(Bundle bundle)
{
    base.OnCreate (bundle);
    ...
    bool booleanExtra = this.Intent.GetBooleanExtra ("automated", false);
    if (booleanExtra) {
        AndroidRunner.Runner.Options.LoadFromBundle (this.Intent.Extras);
    }
    ...
    if (booleanExtra) {
        ThreadPool.QueueUserWorkItem (delegate {
            Log.Info ("NUnitLite", "NUnit automated tests started");
            AndroidRunner.Runner.Run (this.current_test, this);
            Log.Info ("NUnitLite", "NUnit automated tests completed");
            this.Finish ();
        });
    }
    Log.Info ("NUnitLite", "NUnit automated tests loaded.");
}
{% endhighlight %}
Here we start to see some interesting stuff. The method gets a boolean extra from the intent called "automated". This
is then used to decide whether to load additional options from the extras. The value is used again later on to determine
whether to automatically run the tests and finish the activity when the tests have completed, or wait for the user to
manually run the tests. So, we know that adding a boolean called "automated" to the intent's extras that is set to true
will cause the tests to be automatically run. But how do we get the results to be sent to a waiting server? The key is
in the `AndroidRunner.Runner.Options.LoadFromBundle` method:
{% highlight c# %}
public void LoadFromBundle(Bundle bundle)
{
    this.EnableNetwork = bundle.GetBoolean ("remote", false);
    this.HostName = (bundle.GetString ("hostName") ?? "0.0.0.0");
    this.HostPort = bundle.GetInt ("hostPort", -1);
}

public bool ShowUseNetworkLogger
{
    get
    {
        return this.EnableNetwork && !string.IsNullOrWhiteSpace (this.HostName) && this.HostPort > 0;
    }
}
{% endhighlight %}

This provides the last piece of the puzzle. The host name and port are also pulled from the intent's extras. The property
`ShowUseNetworkLogger`, which is based on the "remote" extra, is used in `AndroidRunner` to determine whether to create
a `TcpTextWriter` for writing the results, or just write to the console.

We can bring all this knowledge together in to a new class:
{% highlight c# %}
public abstract class AutomatedTestSuiteActivity : TestSuiteActivity
{
    protected override void OnCreate(Bundle bundle)
    {
        Intent.PutExtra ("automated", true);
        Intent.PutExtra ("remote", true);
        Intent.PutExtra ("hostName", HostName);
        Intent.PutExtra ("hostPort", HostPort);
        base.OnCreate (bundle);
    }

    public override void Finish ()
    {
        System.Environment.Exit (0);
    }

    protected abstract string HostName { get; }
    protected abstract int HostPort { get; }
}
{% endhighlight %}
This class now handles setting all the appropriate extras, all the extending class has to do is implement properties
for the host name and port. Additionally, the `Finish` method has been overridden so that it forces the process to exit,
ensuring that the application does not hang around after the tests have finished.

I hope that this post is useful to anyone else that is investigating automated Android unit tests with Xamarin and feel
free to use the `AutomatedTestSuiteActivity`.

{% include section_header.html name="References" %}
* [Xamarin](xamarin.com)
* [iOS Unit Testing - Xamarin](http://developer.xamarin.com/guides/ios/deployment,_testing,_and_metrics/touch.unit/)
* [NUnitLite Unification - nunit/dev wiki](https://github.com/nunit/dev/wiki/NUnitLite-Unification)
* [NUnit.UI.TouchRunner](http://iosapi.xamarin.com/?link=T%3aNUnit.UI.TouchRunner)