## Background
* ITSO
	* Responsible for smart ticketing specs
		* Card types
		* Backend systems
* Remote Ticket Download Server (RTDS)
	* "Remote POST"
	* ITSO-certified


<aside class="notes" data-markdown>
<ul>
	<li>ITSO (Interoparable Transport Standards Organisation)
 		<ul>
 			<li>Responsible for the specifications related to smart ticketing schemes in the UK</li>
			<li>From behaviour of cards to backend systems requried for a scheme to work (e.g. card management system)</li>
			<li>All schemes in UK itso-compliant (or working towards it)</li>
			<li>Majority of Ecebs work is in developing ITSO-compatible operating systems for cards, and also developing implementations of the various backend systems</li>
		</ul>
	</li>
	<li>RTD
		<ul>
			<li>Uses any device that can communicate with smartcard as a proxy</li>
			<li>Device receives commands from RTD, sends them to the card and sends back the responses</li>
			<li>Allows RTD to modify the contents of a smartcard remotely</li>
			<li>RTD is ITSO-certified, meaning that devices that use it don't have to pass certification before being used in ITSO schemes</li>
		</ul>
	</li>
</ul>
</aside>