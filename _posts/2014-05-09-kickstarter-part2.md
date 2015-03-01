---
layout: post
title: Scraping Kickstarter - Part 2 - Kyle Bremner | Software Engineer
item_title: Scraping Kickstarter - Part 2
tags: android java kickstarter scraping api
sections:
  - API Issues
  - Wrap Up
published: true
---

After writing my [first post]({% post_url 2014-03-15-kickstarter-part1 %}) looking at scraping Kickstarter, I started looking in to writing a library for obtaining information from the site and an application that used it. All was going well, until I hit upon one of the biggest issue with relying on private APIs - they can change at a second's notice.

{% include section_header.html name="API Issues" %}
I created a project on GitHub called [Kickscraper](https://github.com/kbremner/Kickscraper) that deals with exposing the means of searching Kickstarter, logging in a user, etc. Currently, the search functionality all seems to work as expected. However, today, the login functionality broke. Why? The API had changed.

To be able to carry out certain tasks, an authenticity token is required. Before the API changed, this was being retrieved from JSON data returned by https://kickstarter.com/login.json. However, today that link now returns a 500 error page. This highlights just how quickly things can change and break all functionality.

Another issue I hit was to do with inconsistencies across the API. For example, some endpoints would give you JSON if that was requested, where as others would always give back HTML content to be inserted in to a page.

{% include section_header.html name="Wrap Up" %}
I've learnt some interesting things while investigating Kickstarter's site about how responsive front ends can make use of APIs to provide functionality to users without having to navigate away from the page. I also learnt some of the difficulities of working with private APIs, in that they can change quickly and be inconsistent.

I've decided not to continue with the project, but I've kept the code on GitHub in case it is of use to anyone else. I hope that Kickstarter soon realise the error of their ways and release an Android application as well, but until then there's still the website.

<div class="alert alert-info">
<p>I mentioned in the last post that Kickstarter does have another API, but that I couldn't get access to it. Well, I stumbled upon <a href="http://syntaxi.net/2013/03/24/let-s-explore-kickstarter-s-api/">this blog post</a> which covers the basics of how to access it and use it which might be of use to some of you reading this post.</p>
</div>
