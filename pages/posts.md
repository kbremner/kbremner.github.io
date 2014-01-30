---
layout: default
title: "Posts - Kyle Bremner | Software Engineer"
published: true
---

Posts:

{% for post in site.posts %}
* {{ post.title }}
{{ post.excerpt }}
{% endfor %}
