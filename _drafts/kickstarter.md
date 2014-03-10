---
layout: post
title: Scraping Kickstarter - Part 1
sections: 
  - Getting Projects
  - Getting a Project
tags: android java kickstarter scraping api
published: true
---

Having backed a few projects on Kickstarter, It was a bit annoying when they released a new iPhone application, but nothing for Android users. There are a couple of third party apps on Google Play, however I thought I'd take a shot at scraping Kickstarter and seeing how much information I could get, and what I could create. This post is the first in a series following my progress.

<div class="alert alert-info">
<p>
Kickstarter do actually have their own API, as you will see in the JSON data. However, attempting to use it results in an angry message stating that it is only for use by their own product.
</p>
</div>

{% include section_header.html name="Getting Projects" %}
###Finding a Data Endpoint
To get information about projects, we could get the web pages and scrape the DOM for the relevant information. However, it is much more efficient to try and obtain the data from the source. This isn't possible in all cases, for instance the data may be used at the server side to render the page before sending it out. However, it's always worth a shot to try and find an endpoint to get data from before going down the DOM parsing route.

A list of all projects on kickstarter can be viewed by going to [https://www.kickstarter.com/discover/advanced](https://www.kickstarter.com/discover/advanced). Changing one of the parameters results in the page being updated without refreshing. When investigating the network traffic, it can be seen that changing a filter causes a GET request to be sent with the appropriate URL parameters and with the `Accept` header set to `application/json`, resulting in JSON data being returned. Further investigation shows that the `Accept` header isn't required - the same effect can be achieved if advanced.json is used in the URL, i.e. [https://www.kickstarter.com/discover/advanced.json](https://www.kickstarter.com/discover/advanced.json).

###Endpoint Parameters
So now we have an endpoint that we can get JSON data from, we need to get a feel for how we can use it. Changing the parameters on the page will cause different requests to be sent. For instance, changing the category to Art results in the `category_id` URL paremter being added, set to 1. As we've seen previously, changing the sort type results in the `sort` URL parameter being added. Going through all the possible choices for each gives the values that can be used.

The location parameter, `woe_id`, is different, as it requires an ID for the location to be provided. However, all is not lost. Pressing on the location opens a popover element. Entering text in the search box results in another request being sent to another endpoint, with a URL parameter specifying the search term(s), i.e. [https://www.kickstarter.com/locations/search?searchable=true&term=london+UK](https://www.kickstarter.com/locations/search?searchable=true&term=london+UK). JSON data is returned, containing locations that match the search terms. The ID in one of the locations can then be used as the value for the `woe_id` URL parameter.

It's worth noting that the results are paginated. Scrolling to the bottom of the first linked page and pressing "load more" will result in another request being sent to the advanced endpoint with a `page` URL parameter. The parameter value can be incremented until the returned JSON data contains no projects, meaning that all the results have been returned.

{% include section_header.html name="Getting a Project" %}
