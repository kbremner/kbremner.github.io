---
layout: default
title: "Posts - Kyle Bremner | Software Engineer"
published: true
---

{% for post in site.posts %}
<div class="panel panel-primary">
<div class="panel-heading post-title"><a href="{{ post.url }}" style="text-decoration:none;">{{ post.title }}</a> - <small>{% include format_date.html time=post.date %}</small></div>
<div class="panel-body"><em>{{ post.excerpt }}</em></div>
{% if post.tags.size > 0 %}
<div class="panel-footer">{{ post.tags | array_to_sentence_string }}</div>
{% endif %}
</div>
{% endfor %}
