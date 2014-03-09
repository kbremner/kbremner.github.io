---
layout: post
title: Hello Spotify
sections: 
  - Setting Up
  - JNI Example
  - C Code
  - Java Code
  - Summary
  - References
tags: libspotify android ndk java c
published: true
---

Recently I got round to having a look at Spotify's developer library, [libspotify](https://developer.spotify.com/technologies/libspotify/), to try and figure out how to use it within Android apps. As part of this, I decided to create a "Hello Spotify" example project that might be useful to others looking to use the library.

I have created a simple example library project that is available on GitHub [here](https://github.com/kbremner/Hello-Spotify). It only provides a means of logging in, but shows how to use libspotify on Android. The pre-requisites for using it are:

* Android NDK installed (see [here](http://developer.android.com/tools/sdk/ndk/index.html))
* Spotify premium account
* API key (see [here](https://developer.spotify.com/technologies/libspotify/keys/))

Below is a description of the different components of the project and the steps I followed to make it.

{% include section_header.html name="Setting Up" %}
####Get libspotify

The first task is to download the Android version of libspotify from the libspotify homepage. The required file for compiling is in the lib directory of the download. Take the largest file and remove the numbers after .so (this is version information that isn't supported by Android). Also in the download is the header file that will be needed later, under include/libspotify/api.h. Within the Hello Spotify example project, the .so file can be found under jni/libspotify, and the header under jni/headers.

####Get API key

So, now we have the library. Before we can do anything with it, we need the API key, so the C code version should be downloaded and placed in the jni folder as _appkey.c_.

####Write the makefile (Android.mk)

Now we have almost everything we need to start working with libspotify. To be able to make the code, we need a build script, Android.mk:

{% gist 7068332 %}

The Android build tool uses this makefile to compile the modules before putting them in the libs directory to be used by the project. There are a couple of interesting things in the Android.mk file within the project:

* __PREBUILT\_SHARED\_LIBRARY__ - Android needs you to tell it what shared libraries you have, giving them a module name which can be referenced later in the makefile
* __BUILD\_SHARED\_LIBRARY__ - Here, the shared library previously named spotify-prebuilt is referenced so that Android knows it is a build dependency. We also give the new module the name hello_spotify, which we will come across later
* __LOCAL\_LDLIBS__ - Android also needs you to tell it which additional libraries you are using. The project uses Android's logging helper, so we have to include the library.
* __LOCAL\_MODULE__ - the LOCAL_MODULE defines the name of the module. In the PREBUILT section, this is the name to be used to refer to the prebuilt libraries. In the BUILD section, it defines the name for the new library that is to be built.

Now we have everything we need to start writing the actual code!

{% include section_header.html name="JNI Example" %}

In a project like this where we are creating a bridge between C code and Java code, there needs to be some "glue". This glue is written as C methods that are then referenced in the Java code. For the Java compiler to find the native methods, the C method names have to comply to a strict naming convention. This is best explained by example.

Say we have a class, JNIExample, that wants to make a reference to a native method, getString(), that simply returns a string. To do this, JNIExample would look like this:

{% gist 7068549 %}

Here, we see that the native keyword has been used to tell the compiler that the method is linked to a C method. But from here, the compiler has to make the link between the C method and the Java method. To do this, the method name has to follow the convention _Java_\__\<package-name\>_\__\<class-name\>_\__\<native-method-name\>_, as seen below:

{% gist 7068497 %}

The JNIEXPORT and JNICALL allow the method to be called from a Java class. The method naming convention allows the compiler to link the native method to the method in the class that it relates to. The JNIEnv and jobject parameters can be used by the method to more easily interact with the Java code. Finally, as the method returns a String, the return type is a jstring (the JNIEnv provides methods for converting between char*'s and jstrings).

It is best not to try and write the C header yourself. The Java tool javah can create the appropriate C header file by pointing it to a compiled Java class that makes references to native methods. It will take care of all the parameter and return type conversion, as well as the naming convention.

There is an alternative, which is to use JNI_OnLoad to register the native methods, but that's beyond the scope of this article. For more details about this approach, see [here](http://sbcgamesdev.blogspot.co.uk/2012/12/using-jnionload-in-adroid-ndk.html).

{% include section_header.html name="C Code" %}
####Writing it

The Hello Spotify project just has 3 C files:

* __appkey.c__ - your app key obtained from Spotify's website
* __callbacks.c__ - the callback methods used by libspotify to notify us of events
* __hello\_spotify.c__ - holds our JNI glue

As for headers, we have:

* __callbacks.h__ - defines what callbacks we have implemented
* __com\_deftech\_spotify\_HelloSpotify.h__ - the javah-generated header file

The callback methods mainly just log using the Android logging methods. The only one that is a bit different is the __logged\_in__ callback, that takes some of the logic from one of the libspotify examples to log some details about the logged in user.

The interesting stuff here is in hello_spotify.c. First, lets look at the method for getting the build ID:

{% gist 7068897 %}

Here, we see the use of the JNIEnv to convert a char* returned by the libspotify method sp\_build\_id() in to a jstring that can be returned by the method in the Java class.

Now we've seen a simple method, we can move on to the more complicated log in method. To log in, we first need to create a session. To create a session, we need to provide a sp\_session\_config struct filled with config values. These include the location to be used as cache, the app key, the callbacks, etc. Once that has been filled, the session can be created by calling sp_session_create, passing it the config settings and a double pointer that it can set to point to an allocated session.

Once the session is created, we can login with the provided username and password. If this was successful, we can then create a background thread for calling sp\_session\_process\_events.

This background thread is important, as libspotify has many internal threads that are synchronized by pushing tasks that are executed when the sp_session_process_events method is called by an application thread. It relies on this thread listening for calls to the notify_main_thread callback, as that is libspotify saying that there are events to be processed. Additionally, the application needs to make sure that no other libspotify methods are called while sp_session_process_events is executing. As this process can get difficult to manage, I thought it was best to leave it out of this simple example. The psyonspotify example in the references shows one of it doing it.

####Problems with Login Code

Note that the approach for the login method is naive in a number of ways:

* from the libspotify documentation here, it states that it is not supported to have multiple active sessions, and it's recommended to only call this [sp\_create\_session] once per process. It would be better to have an init method that creates a session that can be used later for operations like logging in a user. This is why if you attempted to call login a few times your app will eventually crash.
* The main\_loop thread doesn't respect the timeout or the notify_main_thread callback.
* The "blob" that can be used for remembering users isn't handled.

####Building it

The NDK code has to be compiled from the command line. Navigate to the root of the project and simply run ndk-build. This will compile the code, outputting any build errors. I found it was best to clean the project in eclipse first, run ndk-build, then refresh the eclipse project.

{% include section_header.html name="Java Code" %}

Now that we've written and compiled our C code, the next step is the Java class to wrap the native code, HelloSpotify:

{% gist 7070128 %}

This class is quite simple, as most of the logic of mapping the C methods to the Java methods has already been done. The important bit is the static call to load the library name specified in Android.mk. But that's it for the Java code!

{% include section_header.html name="Summary" %}

This example project can be cloned from GitHub and (after putting in your appkey.c) used as a library project by other Android projects. It provides a simple look at how to use a native library by writing the JNI glue to call it from a Java class.

Any comments/queries, just drop a comment below!

{% include section_header.html name="References" %}

* [libspotify examples](https://developer.spotify.com/docs/libspotify/12.1.45/examples.html)
* [GitHub: spotify/psyonspotify](https://github.com/spotify/psyonspotify)
