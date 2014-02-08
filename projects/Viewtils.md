---
layout: project
title: "Viewtils - Kyle Bremner | Software Engineer"
published: true
name: Viewtils
github: "https://github.com/kbremner/Viewtils"
tagline: "Help to seach an Andriod application's UI"
travis: "https://travis-ci.org/kbremner/Viewtils"
coveralls: "https://coveralls.io/r/kbremner/Viewtils?branch=master"
"coveralls-badge": "https://coveralls.io/repos/kbremner/Viewtils/badge.png?branch=master"
---

<div class="project-title panel panel-default"><div class="panel-body"><h1><a href="https://github.com/kbremner/Viewtils" target="_blank">Viewtils</a> <br class="visible-xs"><small>Help to seach an Andriod application's UI</small></h1>
</div><div class="panel-footer"><a href="https://travis-ci.org/kbremner/Viewtils" target="_blank"><img class="build-info-tag" src="https://travis-ci.org/kbremner/Viewtils.png"></a> <a href="https://coveralls.io/r/kbremner/Viewtils?branch=master" target="_blank"><img class="build-info-tag" src="https://coveralls.io/repos/kbremner/Viewtils/badge.png?branch=master"></a></div></div>
Viewtils is a library to aide in finding UI elements that meet one or more `Requirement`s, a task that is common when constructing unit tests for an application.

It aims to not be reliant on instances of classes only accessable under test (i.e. `Instrumention`). This means that the library can easily be used with other testing frameworks, or be used within an application.

Influences
----
Viewtils has been inspired by a number of very good libraries that are commonly used for testing Android applications:

- [Robotium](https://code.google.com/p/robotium/)
- [Robolectric](http://robolectric.org/) (also used for unit testing Viewtils)
- [Hamcrest](https://code.google.com/p/hamcrest/)
- [FEST Android](https://github.com/square/fest-android)

API Examples
----

- Find a `View` based on ID:

{% gist 8884784 findById.java %}

- Find a `TextView` based on a regex:

{% gist 8884784 findByRegex.java %}

- Search using multiple requirements:

{% gist 8884784 multipleReqs.java %}

- Find multiple matches & invert a `Requirement`:

{% gist 8884784 findMultipleInvert.java %}

- Search based on a custom `Requirement`:

{% gist 8884784 customReq.java %}

- Click on a view:

{% gist 8884784 click.java %}

- Select an item in a spinner:

{% gist 8884784 spinnerClick.java %}

- Carry out a method call on another thread:

{% gist 8884784 callMethod.java %}

Dependencies
---

- Android 2.1 (API level 7) or greater

License
----
Apache License Version 2.0