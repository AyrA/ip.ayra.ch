namespace AyrA {
	/** Basic API response from the ping service */
	type PingApiResponse = {
		/** Information about the pinged host */
		Host: HostInfo,
		/** Result of the ping */
		Ping: PingResult,
		/**
		 * Traceroute to the host.
		 * The trace is aborted if 3 consecutive routers do not respond.
		 * To detect if the trace was aborted,
		 * the last entry in the trace list can be checked for an IP address match with PingApiResponse.Host
		 */
		Trace: HostInfo[]
	}

	/**
	 * DNS + IP info
	 */
	type HostInfo = {
		/** DNS name. Is null if the IP address cannot be resolved to a name */
		Name: string | null,
		/**
		 * IP addresses that "Name" resolves to.
		 * If "Name" doesn't resolves back to the original IP address it will forcibly be added
		 */
		Addresses: string[]
	};

	/** Result of a ping */
	type PingResult = {
		/** IP address the ping was sent to */
		"SentTo": string,
		/**
		 * IP address that responded.
		 * Usually the same as "SendTo" but can be different, especially on failure because failure codes are usually sent by a different device
		 */
		"ReplyFrom": string | null,
		/** Result of the ping */
		"Result": IPStatus,
		/**
		 * Number of milliseconds until an answer was obtained.
		 * Will likely be zero if "Result" isn't "Success"
		*/
		"RoundtripTime": number
	};

	/**
	 * Possible values for an ICMP response.
	 * Not all values are actually possible with an ICMP Echo.
	 * At the very minimum "Success" and "TimedOut" should be implemented
	 */
	type IPStatus = "Success" | "DestinationNetworkUnreachable" | "DestinationHostUnreachable" |
		"DestinationProtocolUnreachable" | "DestinationProhibited" | "DestinationPortUnreachable" |
		"NoResources" | "BadOption" | "HardwareError" | "PacketTooBig" | "TimedOut" | "BadRoute" |
		"TtlExpired" | "TtlReassemblyTimeExceeded" | "ParameterProblem" | "SourceQuench" | "BadDestination" |
		"DestinationUnreachable" | "TimeExceeded" | "BadHeader" | "UnrecognizedNextHeader" | "IcmpError" |
		"DestinationScopeMismatch" | "Unknown";

	/** Permitted values for the "sub" parameter of "Ping" */
	type IpHost = "ip" | "ip4" | "ip6";

	/**
	 * Pings the current client and performs a traceroute
	 * @param sub subdomain to connect to. Used to force IPv4 or IPv6. Default is client preferred method
	 * @returns API response
	 */
	export async function Ping(sub?: IpHost): Promise<PingApiResponse> {
		if (!sub) {
			sub = "ip"
		};
		if (!sub.match(/^ip[46]?$/i)) {
			throw new Error(`Invalid subdomain: ${sub}`);
		}

		const response = await fetch(`https://${sub}.ayra.ch/ping`);
		if (!response.ok) {
			throw new IpError("Got unexpected status response", ErrorCodes.InvalidHttpStatus, { status: response.status, statusText: response.statusText });
		}
		return await response.json() as PingApiResponse;
	}


}