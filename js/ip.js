"use strict";
var AyrA;
(function (AyrA) {
    /** Base error class for all manually thrown exceptions. This inherits from js Error class */
    class IpError extends Error {
        /** Error code */
        #errorCode;
        /** Optional extra data */
        #extraData;
        /** Gets the error code associated with this error */
        get code() { return this.#errorCode; }
        /** Gets additional data supplied to this error */
        get data() { return this.#extraData; }
        /**
         * Creates an IpError instance
         * @param message Create new instance
         * @param code Error code
         * @param extraData Optional extra data
         */
        constructor(message, code, extraData) {
            super(message);
            this.#errorCode = code;
            this.#extraData = extraData;
        }
    }
    AyrA.IpError = IpError;
    /**
     * Possible error codes for the code property of IpError
     */
    let ErrorCodes;
    (function (ErrorCodes) {
        /** Value returned by the server is an invalid IP address */
        ErrorCodes.InvalidAddress = 1;
        /** Tried to make a request to an invalid subdomain */
        ErrorCodes.InvalidSubdomain = 2;
        /** HTTP status is not 200 Ok */
        ErrorCodes.InvalidHttpStatus = 3;
    })(ErrorCodes = AyrA.ErrorCodes || (AyrA.ErrorCodes = {}));
    ;
    /**
     * Gets client IPv4 and v6 address
     * @returns Object literal containing client IP addresses. Fields may be null if the address is unobtainable
     */
    async function getIpAddresses() {
        //Do requests in parallel
        const v4 = getIpv4(true);
        const v6 = getIpv6(true);
        return {
            v4: await v4,
            v6: await v6
        };
    }
    AyrA.getIpAddresses = getIpAddresses;
    /**
     * Gets the IP address the client uses by default
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IP address
     */
    async function getIp(errorAsNull) {
        return await req("ip", errorAsNull);
    }
    AyrA.getIp = getIp;
    /**
     * Gets the client IPv4 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv4 address
     */
    async function getIpv4(errorAsNull) {
        return await req("ip4", errorAsNull);
    }
    AyrA.getIpv4 = getIpv4;
    /**
     * Gets the client IPv6 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv6 address
     */
    async function getIpv6(errorAsNull) {
        return await req("ip6", errorAsNull);
    }
    AyrA.getIpv6 = getIpv6;
    /**
     * Basic request method for IP address
     * @param sub Subdomain
     * @param errorAsNull true, to return null on errors, false to throw an exception
     * @returns IP address, or null on failure if errorAsNull is set
     */
    async function req(sub, errorAsNull) {
        if (!isSubdomain(sub)) {
            if (errorAsNull) {
                return null;
            }
            throw new Error(`Invalid subdomain: ${sub}`);
        }
        try {
            const response = await fetch(`https://${sub}.ayra.ch/ip`);
            if (!response.ok) {
                throw new IpError("Got unexpected status response", ErrorCodes.InvalidHttpStatus, { status: response.status, statusText: response.statusText });
            }
            const body = (await response.text()).trim();
            if (!isIp(body)) {
                throw new IpError("Server returned a value that is not an IP address", ErrorCodes.InvalidAddress, body);
            }
            return body;
        }
        catch (e) {
            if (errorAsNull) {
                return null;
            }
            throw e;
        }
    }
    /**
     * Checks if the value is a valid IPv4 or IPv6 address
     * @param value Possible IP address
     * @returns true, if the value is a valid IP address
     *
     * This will not consider IPv4 mapped V6 addresses as valid
     */
    function isIp(value) {
        //IPv4
        if (value.match(/^(?:(?:25[0-5]|2[0-4]\d|1?\d{1,2})(?:\.(?!$)|$)){4}$/)) {
            return true;
        }
        //IPv6
        if (value.match(/^([\dA-F]{1,4}(?::[\dA-F]{1,4}){7}|::|:(?::[\dA-F]{1,4}){1,6}|[\dA-F]{1,4}:(?::[\dA-F]{1,4}){1,5}|(?:[\dA-F]{1,4}:){2}(?::[\dA-F]{1,4}){1,4}|(?:[\dA-F]{1,4}:){3}(?::[\dA-F]{1,4}){1,3}|(?:[\dA-F]{1,4}:){4}(?::[\dA-F]{1,4}){1,2}|(?:[\dA-F]{1,4}:){5}:[\dA-F]{1,4}|(?:[\dA-F]{1,4}:){1,6}:)$/i)) {
            return true;
        }
        return false;
    }
    /**
     * Checks if the value is a valid subdomain label
     * @param value Possible subdomain value
     * @returns true, if valid subdomain
     */
    function isSubdomain(value) {
        if (typeof (value) !== "string" || value.length === 0) {
            return false;
        }
        return value.match(/\W/) === null;
    }
})(AyrA || (AyrA = {}));
var AyrA;
(function (AyrA) {
    /**
     * Pings the current client and performs a traceroute
     * @param sub subdomain to connect to. Used to force IPv4 or IPv6. Default is client preferred method
     * @returns API response
     */
    async function ping(sub) {
        if (!sub) {
            sub = "ip";
        }
        ;
        if (!sub.match(/^ip[46]?$/i)) {
            throw new Error(`Invalid subdomain: ${sub}`);
        }
        const response = await fetch(`https://${sub}.ayra.ch/ping`);
        if (!response.ok) {
            throw new AyrA.IpError("Got unexpected status response", AyrA.ErrorCodes.InvalidHttpStatus, { status: response.status, statusText: response.statusText });
        }
        return await response.json();
    }
    AyrA.ping = ping;
})(AyrA || (AyrA = {}));
//# sourceMappingURL=ip.js.map