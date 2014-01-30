---
layout: default
title: "Posts - Kyle Bremner | Software Engineer"
published: true
---

Posts:
{% for post in site.posts %}
* [{{ post.title }}]({{ post.url }}) ({{ post.date | date_to_long_string }})
<em>{{ post.excerpt }}</em>
{% endfor %}