## Testing
* Data-driven
* Language-specific test runners
* Mock RTDS


<aside class="notes">
<ul>
	<li>So as I said before, we decided that as the specification was language-independent, the tests should be too.</li>
	<li>Tests were defined against the specification, with property files defining the characteristics of the test, i.e. what method was under test, what parameters should be passed to it and what the expected outcome is</li>
	<li>Created language-specific test runners that understood the test specifications and could use them to carry out the tests</li>
	<li>I created a mock RTDS that could be configured by a test runner using the test data to behave as required for that particular test, i.e. return a specific error code</li>
	<li>This turned out to be a pretty effective strategy, finding issues in both implementations prior to release</li>
</ul>
</aside>