---
layout: default
title: "Viewtils - Kyle Bremner | Software Engineer"
published: true
---

<div class="page-header">
<h1><a href="https://github.com/kbremner/Viewtils" target="_blank">Viewtils</a> <br class="visible-xs"><small>Help to seach an Andriod application's UI</small></h1>
<a href="https://travis-ci.org/kbremner/Viewtils" target="_blank"><img class="build-info-tag" src="https://travis-ci.org/kbremner/Viewtils.png"></a> <a href="https://coveralls.io/r/kbremner/Viewtils?branch=master" target="_blank"><img class="build-info-tag" src="https://coveralls.io/repos/kbremner/Viewtils/badge.png?branch=master"></a>
</div>
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

```java
View view = with(activity).find(View.class).where(idIs(R.id.textView1));
```

- Find a `TextView` based on a regex:

```java
Button button = with(viewGroup).find(Button.class).where(textMatches("Click.*");
```

- Search using multiple requirements:

```java
List<Requirement<? super TextView>> reqs = new ArrayList<Requirement<? super TextView>>();
reqs.add(textIs(R.string.some_msg));
reqs.add(idIs(R.id.textView));

// Get a text view that matches *all* provided requirements
TextView result = with(activity).find(TextView.class).where(matchesAll(reqs));      

// Get a text view that matches *any* provided requirements
TextView result = with(activity).find(TextView.class).where(matchesAny(reqs));

// Alternatively... (Note that your editor will complain about the use of generics with varargs)
TextView result = with(activity).find(TextView.class)
                    .where(matchesAll(idIs(R.id.textView), textIs(R.string.some_msg)));
```

- Find multiple matches & invert a `Requirement`:

```java
List<Button> result = with(activity).find(Button.class).allWhere(not(textIs(R.string.some_msg)));
```

- Search based on a custom `Requirement`:

```java
TextView view = with(activity).find(TextView.class).where(new Requirement<View>() {
    @Override public boolean isMatch(View instance) {
        return instance.getVisibility() == View.VISIBLE;
    }
});
```

- Click on a view:

```java
with(activity).click(Button.class).where(textMatches("Click.*"));
```

- Select an item in a spinner:

```java
// Select the item after getting the spinner
TextView spinnerItem = with(spinner).click(TextView.class).where(textIs("Item 3"));

// Or find it within an activity
spinnerItem = with(activity).click(TextView.class).where(textIs("Item 2"));
```

- Carry out a method call on another thread:

```java
// By default calls are posted to the main looper to be carried out
execute(textView, "setText")
    .withParameter("Some text", CharSequence.class)
    .returningNothing();

CharSequence text = execute(textView, "getText")
    .withHandler(handler)
    .in(3, TimeUnit.SECONDS)
    .returning(CharSequence.class);
```

Dependencies
---

- Android 2.1 (API level 7) or greater

License
----
Apache License Version 2.0