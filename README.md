# ip.ayra.ch

This is the JS and TS library to make requests to https://ip.ayra.ch from your website

## Installation

You can either include the files in the **ts** or **js** folder.
Use the **ts** folder if your project uses TypeScript.
Use the **js** folder if you don't have typescript or don't want the TypeScript source.

To use this like any other external library, add the js file from the **js** directory to your library folder,
and add the TS declaration file from **js/decl** to your declaration folder.

## Usage

- `AyrA.getIp(errorAsNull)`: Get the current IP address. Lets the browser decide whether to use IPv4 or IPv6
- `AyrA.getIpv4(errorAsNull)`: Get the current IP address. Forces IPv4
- `AyrA.getIpv6(errorAsNull)`: Get the current IP address. Forces IPv6
- `AyrA.getIpAddresses(errorAsNull)`: Get the current IP address. Returns an object literal in the form `{v4:string|null, v6:string|null}`

### Handling errors

The easiest way is to supply `true`for the `errorAsNull` argument.
This suppresses exceptions from the library and simply returns `null`.
This of course stops you from seeing what actually went wrong.
If you don't supply that argument, or have it set to a falsy value, errors will be thrown if problems arise.

You may get two types of errors:

#### Type `IpError`

This is an error manually thrown by the library, for example if it got a response but it doesn't makes sense.
This error has a `code` and `data` property.
You can find all possible error codes in AyrA.ErrorCodes.
The `data` is freeform any may contain additional information. It may be of any type.

#### Other Error Types

All other error types are thrown by the browser itself. These are not wrapped inside of an `IpError`

## CORS

You may see CORS errors in the console. This is normal if a client lacks either an IPv4 or IPv6 address and you request it.
If a request cannot be completed, a browser assumes a CORS policy that matches nothing.
These error messages may be printed into the console by the browser regardless of whether you suppress errors or not.