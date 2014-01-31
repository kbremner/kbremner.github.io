---
layout: default
title: "Kyle Bremner | Software Engineer"
published: true
---

Hello World! Here's some text...

Example Gist:

{% gist 7070128 %}

The same using gist-embed script:
<code data-gist-id="7070128" data-gist-hide-footer="true" data-gist-hide-line-numbers="true" data-gist-highlight="8"></code>

The same as a code import:

```java
package com.deftech.spotify;
 
import android.content.Context;

public class HelloSpotify {
	private final String cacheDir;
	static {
		System.loadLibrary("hello_spotify");
	}
	
	public HelloSpotify(Context context){
		cacheDir = context.getCacheDir().getAbsolutePath();
	}
 
	public int login(String username, String password){
		return login(username, password, cacheDir);
	}
	
	public native String getBuildID();
	private native int login(String username, String password, String cacheDir);
}
```