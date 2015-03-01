---
layout: post
title: Android and Client Authentication | Kyle Bremner - Software Engineer
item_title: Android and Client Authentication
sections: 
  - System Keystore
  - Getting an Alias
  - Using an Alias
  - References
tags: "android client-authentication"
published: true
---

Recently I have been developing an application that had to support client authentication using certificates. The process wasn't quite as well documented as I would have expected, so this post aims to help others that need to support client authentication in their application (aimed at Ice Cream Sandwich (ICS) and above).

{% include section_header.html name="System Keystore" %}
Traditionally, Android applications created their own keystores for storing sensitive credentials. ICS, however, brought in the ability for applications to access credentials stored in a system keystore when authorised by a user. This not only simplifies the process, but with some devices supporting hardware-backed keystores, it can also be more secure than an application keystore stored in the file system.

<div class="alert alert-info">
<p>
If credentials using a particular algorithm are stored using a hardware feature, such as a secure element or Trusted Execution Environment (TEE), they are effectively "bound" to that particular device once installed and so protected against extraction. To determine if an algorithm is hardware-backed, the method <a href="https://developer.android.com/reference/android/security/KeyChain.html#isBoundKeyAlgorithm(java.lang.String)" target="_blank">KeyChain.isBoundKeyAlgorithm(String)</a> can be used.
</p>
</div>

{% include section_header.html name="Getting an Alias" %}
Before an application can use credentials stored in the system keystore, the user needs to give the application access to them. The KeyChain API provides a simple means of doing this:
{% gist kbremner/6206d58ff0b9545de603 getAlias.java %}
The user will be shown a dialog where they can select a certificate currently stored in the system keystore, or install a new certificate. When the user selects a certificate and closes the dialog, the callback will be given an alias for the selected certificate that it can use to access it. If the user cancels the dialog, the callback will be given a null alias.

<div class="alert alert-warning">
<p>
It is important to note that although the KeyChain API allows an application to provide hints as to which certificate the user should choose, it cannot force the user to select a particular certificate
</p>
</div>

{% include section_header.html name="Using an Alias" %}
Once an application has an alias for a certificate, it can be used to obtain information associated with it. Below is an example implementation of an X509KeyManager that uses the alias for a certificate to get it's certificate chain and private key. This can then be used to initialise an SSL context, before setting a URL connection to use the SSL context to allow it to support client authentication, as shown below. Note that the X509Impl instance should be cached instead of being created for each connection, as getting the certificate chain and private key can be slow.
{% gist kbremner/6206d58ff0b9545de603 X509Impl.java %}

{% include section_header.html name="References" %}
* [android.security.KeyChain](https://developer.android.com/reference/android/security/KeyChain.html)
* [Unifying Key Store Access in ICS](http://android-developers.blogspot.co.uk/2012/03/unifying-key-store-access-in-ics.html)
* [Android Email Client - SSLUtils.java](https://github.com/android/platform_packages_apps_email/blob/master/emailcommon/src/com/android/emailcommon/utility/SSLUtils.java)
