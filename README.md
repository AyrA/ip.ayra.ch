# ip.ayra.ch

This is the JS and TS library to make requests to https://ip.ayra.ch from your website

## Installation

You can either include the files in the `ts` or `js` folder.
- "ts": Recommended if your project uses TypeScript and you want the JS files built together with the rest of your TypeScript.
- "js": For all other projects or to exclude this library from your TypeScript build process.

To use this like any other external library, add the js file from the `js` directory to your library folder,
and add the `ip.d.ts` TS declaration file to your declaration folder if you haven't set up your tsconfig to globally search for declarations.

## Usage IP Retrieval

- `AyrA.getIp(errorAsNull)`: Get the current IP address. Lets the browser decide whether to use IPv4 or IPv6
- `AyrA.getIpv4(errorAsNull)`: Get the current IP address. Forces IPv4
- `AyrA.getIpv6(errorAsNull)`: Get the current IP address. Forces IPv6
- `AyrA.getIpAddresses(errorAsNull)`: Get the current IP address. Returns an object literal in the form `{v4:string|null, v6:string|null}`

## Usage Ping and Traceroute

- `AyrA.ping("ip"|"ip4"|"ip6")`: Performing a ping and traceroute to the current client, optionally forcing IPv4 or IPv6
- `AyrA.ping()`: Alias for using `"ip"` as parameter

## Handling Errors

The easiest way is to supply `true` for the `errorAsNull` argument.
This suppresses exceptions from the library and simply returns `null`.
This of course stops you from seeing what actually went wrong.
If you don't supply that argument, or have it set to a falsy value, errors will be thrown if problems arise.

You may get two types of errors:

### Type `IpError`

This is an error manually thrown by the library, for example if it got a response but it doesn't makes sense.
This error has a `code` and `data` property.
You can find all possible error codes in `AyrA.ErrorCodes`.
The `data` is freeform and may contain additional information. It may be of any type.

### Other Error Types

All other error types are thrown by the browser itself. These are not wrapped inside of an `IpError`

## CORS

You may see CORS errors in the console. This is normal if a client lacks either an IPv4 or IPv6 address and you request it.
If a request cannot be completed, a browser assumes a CORS policy that matches nothing.
These error messages may be printed into the console by the browser regardless of whether you suppress errors or not.

## Content Security Policy

If you make use of this header on your website and restrict JS in such a way that it cannot make requests to other domains, whitelist those domains:

- ip.ayra.ch
- ip4.ayra.ch
- ip6.ayra.ch
