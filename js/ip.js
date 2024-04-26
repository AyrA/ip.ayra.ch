"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var AyrA;
(function (AyrA) {
    var _IpError_errorCode, _IpError_extraData;
    /** Base error class for all manually thrown exceptions. This inherits from js Error class */
    class IpError extends Error {
        /** Gets the error code associated with this error */
        get code() { return __classPrivateFieldGet(this, _IpError_errorCode, "f"); }
        /** Gets additional data supplied to this error */
        get data() { return __classPrivateFieldGet(this, _IpError_extraData, "f"); }
        /**
         * Creates an IpError instance
         * @param message Create new instance
         * @param code Error code
         * @param extraData Optional extra data
         */
        constructor(message, code, extraData) {
            super(message);
            /** Error code */
            _IpError_errorCode.set(this, void 0);
            /** Optional extra data */
            _IpError_extraData.set(this, void 0);
            __classPrivateFieldSet(this, _IpError_errorCode, code, "f");
            __classPrivateFieldSet(this, _IpError_extraData, extraData, "f");
        }
    }
    _IpError_errorCode = new WeakMap(), _IpError_extraData = new WeakMap();
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
    function getIpAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            //Do requests in parallel
            const v4 = getIpv4(true);
            const v6 = getIpv6(true);
            return {
                v4: yield v4,
                v6: yield v6
            };
        });
    }
    AyrA.getIpAddresses = getIpAddresses;
    /**
     * Gets the IP address the client uses by default
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IP address
     */
    function getIp(errorAsNull) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield req("ip", errorAsNull);
        });
    }
    AyrA.getIp = getIp;
    /**
     * Gets the client IPv4 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv4 address
     */
    function getIpv4(errorAsNull) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield req("ip4", errorAsNull);
        });
    }
    AyrA.getIpv4 = getIpv4;
    /**
     * Gets the client IPv6 address
     * @param errorAsNull If true, return null instead of throwing errors
     * @returns IPv6 address
     */
    function getIpv6(errorAsNull) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield req("ip6", errorAsNull);
        });
    }
    AyrA.getIpv6 = getIpv6;
    /**
     * Basic request method for IP address
     * @param sub Subdomain
     * @param errorAsNull true, to return null on errors, false to throw an exception
     * @returns IP address, or null on failure if errorAsNull is set
     */
    function req(sub, errorAsNull) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isSubdomain(sub)) {
                if (errorAsNull) {
                    return null;
                }
                throw new Error(`Invalid subdomain: ${sub}`);
            }
            try {
                const response = yield fetch(`https://${sub}.ayra.ch/ip`);
                if (!response.ok) {
                    throw new IpError("Got unexpected status response", ErrorCodes.InvalidHttpStatus, { status: response.status, statusText: response.statusText });
                }
                const body = (yield response.text()).trim();
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
        });
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
//# sourceMappingURL=ip.js.map