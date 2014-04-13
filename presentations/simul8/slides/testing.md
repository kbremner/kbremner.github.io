## Testing
* Data-driven
* Language-specific test runners
* Mock RTDS


<aside class="notes">
<ul>
	<li>Tests are defined against the specification. Define what parameters should be provided to a method, and what the result should be.</li>
	<li>Created language-specific test runners that understand the test specifications and use them to carry out the test</li>
	<li>Created a mock RTDS that could be configured by a test runner using the test data to behave as required for that particular test, i.e. return a specific error code</li>
	<li>Test runners were implemented for both the C# and Java implementations, and successfully found issues in both that were fed back in to the development phase</li>
</ul>
</aside>