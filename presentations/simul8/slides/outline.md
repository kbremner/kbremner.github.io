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
	<li>Going to start with some background</li>
	<li>ITSO (Interoparable Transport Standards Organisation)
 		<ul>
 			<li>Responsible for the specifications related to smart ticketing schemes in the UK, defining everything from behaviour of cards/gates/terminals, to backend systems requried for a scheme to work</li>
			<li>Majority of Ecebs work is in developing implementations of the various backend systems, and also in developing ITSO-compatible operating systems for smartcards</li>
		</ul>
	</li>
	<li>Also develop RTDS
		<ul>
			<li>Is a Remote Point of Sale Terminal</li>
			<li>Any device that can communicate with a smartcard to act as a proxy for RTDS, relaying received commands to the smartcard and sending back the responses</li>
			<li>This allows RTDS to setup a secure connection with the card, allowing it to modify it's contents (for instance to top up the balance or add a new ticket)</li>
			<li>Any device that modifies an ITSO smartcard has to be certified by ITSO. But in this case only RTDS has to be certified, not the proxy device</li>
			<li>So using RTDS makes it much easier to develop an ITSO compatable POST</li>
		</ul>
	</li>
</ul>
</aside>