declare namespace AyrA {
    /** Structure used to return IPv4 and V6 addresses simultaneously */
    type IpInfo = {
        /** IPv4 address */
        v4: string | null;
        /** IPv6 address */
        v6: string | null;
    };
    /** Base error class for all manually thrown exceptions. This inherits from js Error class */
    export class IpError extends Error {
        #private;
        /** Gets the error code associated with this error */
        get code(): number;
        /** Gets additional data supplied to this error */
        get data(): any;
        /**
         * Creates an IpError instance
         * @param message Create new instance
         * @param code Error code
         * @param extraData Optional extra data
         */
        constructor(message: string, code: number, extraData?: any);
    }
    /**
     * Possible error codes for the code property of IpError
     */
    export namespace ErrorCodes {
        /** Value returned by the server is an invalid IP address */
        const InvalidAddress = 1;
        /** Tried to make a request to an invalid subdomain */
        const InvalidSubdomain = 2;
        /** HTTP status is not 200 Ok */
        const InvalidHttpStatus = 3;
    }
    /**
     * Gets client IPv4 and v6 address
     * @returns Object literal containing client IP addresses. Fields may be null if the address is unobtainable
     */
    export function getIpAddresses(): Promise<IpInfo>;
    /**
     * Gets the IP address the client uses by default
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IP address
     */
    export function getIp(errorAsNull: boolean): Promise<string | null>;
    /**
     * Gets the client IPv4 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv4 address
     */
    export function getIpv4(errorAsNull: boolean): Promise<string | null>;
    /**
     * Gets the client IPv6 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv6 address
     */
    export function getIpv6(errorAsNull: boolean): Promise<string | null>;
    export {};
}
declare namespace AyrA {
    /** Basic API response from the ping service */
    type PingApiResponse = {
        /** Information about the pinged host */
        Host: HostInfo;
        /** Result of the ping */
        Ping: PingResult;
        /**
         * Traceroute to the host.
         * The trace is aborted if 3 consecutive routers do not respond.
         * To detect if the trace was aborted,
         * the last entry in the trace list can be checked for an IP address match with PingApiResponse.Host
         */
        Trace: HostInfo[];
    };
    /**
     * DNS + IP info
     */
    type HostInfo = {
        /** DNS name. Is null if the IP address cannot be resolved to a name */
        Name: string | null;
        /**
         * IP addresses that "Name" resolves to.
         * If "Name" doesn't resolves back to the original IP address it will forcibly be added
         */
        Addresses: string[];
    };
    /** Result of a ping */
    type PingResult = {
        /** IP address the ping was sent to */
        "SentTo": string;
        /**
         * IP address that responded.
         * Usually the same as "SentTo" but can be different,
         * especially on failure because failure codes are usually sent by a different device.
         * May be null, especially if no response was received
         */
        "ReplyFrom": string | null;
        /** Result of the ping */
        "Result": IPStatus;
        /**
         * Number of milliseconds until an answer was obtained.
         * Will likely be zero if "Result" isn't "Success"
         */
        "RoundtripTime": number;
    };
    /**
     * Possible values for an ICMP response.
     * Not all values are actually possible with an ICMP Echo.
     * At the very minimum "Success" and "TimedOut" should be implemented
     */
    type IPStatus = "Success" | "DestinationNetworkUnreachable" | "DestinationHostUnreachable" | "DestinationProtocolUnreachable" | "DestinationProhibited" | "DestinationPortUnreachable" | "NoResources" | "BadOption" | "HardwareError" | "PacketTooBig" | "TimedOut" | "BadRoute" | "TtlExpired" | "TtlReassemblyTimeExceeded" | "ParameterProblem" | "SourceQuench" | "BadDestination" | "DestinationUnreachable" | "TimeExceeded" | "BadHeader" | "UnrecognizedNextHeader" | "IcmpError" | "DestinationScopeMismatch" | "Unknown";
    /** Permitted values for the "sub" parameter of "Ping" */
    type IpHost = "ip" | "ip4" | "ip6";
    /**
     * Pings the current client and performs a traceroute
     * @param sub subdomain to connect to. Used to force IPv4 or IPv6. Default is client preferred method
     * @returns API response
     */
    export function ping(sub?: IpHost): Promise<PingApiResponse>;
    export {};
}
//# sourceMappingURL=ip.d.ts.map