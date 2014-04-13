## Java Implementation
* Needed to work on Desktop/Android
* Core = platform-agnostic
	* Delegation pattern

<aside class="notes">
<ul>
	<li>I was responsible for creating the Java implementation, making it work on Desktop and Android</li>
	<li>Main difficulty here was that both platforms have different APIs for interacting with smartcards</li>
	<li>So the approach I decided on was to keep most of the logic in a platform-agnostic core. The delegation pattern was then used to inject the appropriate low level means of sending commands to the smartcard</li>
</ul>
</aside>