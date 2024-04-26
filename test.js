"use strict";

(async function () {
	console.log("testing IPv4:", await AyrA.getIpv4(true));
	console.log("testing IPv6:", await AyrA.getIpv6(true));
	console.log("testing Any IP:", await AyrA.getIp(true));
	console.log("testing combined request:", await AyrA.getIpAddresses());
})();

