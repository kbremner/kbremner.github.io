## Background
* ITSO
	* Responsible for smart ticketing specs
		* Card types
		* Server components
* Remote Ticket Download Server (RTDS)
	* Modify card contents without a local SAM


<aside class="notes" data-markdown>
<ul>
	<li>ITSO (Interoparable Transport Standards Organisation)
 		<ul>
 			<li>Defines specifications for all the required components for a smart ticketing scheme</li>
			<li>Everything from how gates and cards should behave to the backend servers required for recording transactions and allowing cards from other ITSO schemes to be used in a specific theme</li>
			<li>All smart ticketing schemes in the UK must be ITSO-compliant or have a plan for becoming ITSO-compliant</li>
			<li>Ecebs develop on card software and the server components required to create a smart ticketing scheme</li>
		</ul>
	</li>
	<li>RTD (USE WHITE BOARD IF POSSIBLE)
		<ul>
			<li>To modify the contents of a smartcard, need access to a Security Access Module (SAM) with the info required to modify it (i.e. keys). Same process for EMV</li>
			<li>Traditionally, terminal had a local SAM it used for transactions. But terminals expensive and have to manage the SAMs deployed in the field</li>
			<li>RTD is a remote POST, allowing a device to act as a proxy between it and a smart card.
				<ul>
					<li>Allows cheaper devices to be used that can relay commands from RTD to a smart card and send back responses</li>
					<li>Allows SAMs to be stored and managed in a central location</li>
				</ul>
			</li>
			<li>ITSO only requires that RTD be certified as a POST. Terminal developers can create terminals that use RTD and so don't need to be ITSO-certified</li>
		</ul>
	</li>
</ul>
</aside>