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
//# sourceMappingURL=ip.d.ts.map