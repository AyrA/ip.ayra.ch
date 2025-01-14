"use strict";

(async function () {
	//IP address
	console.log("testing IPv4:", await AyrA.getIpv4(true));
	console.log("testing IPv6:", await AyrA.getIpv6(true));
	console.log("testing Any IP:", await AyrA.getIp(true));
	console.log("testing combined request:", await AyrA.getIpAddresses());
	//Ping
	try {
		console.log("testing IPv4:", await AyrA.ping("ip4"));
	}
	catch (e) { }
	try {
		console.log("testing IPv6:", await AyrA.ping("ip6"));
	} catch (e) { }
	try {
		console.log("testing Any IP:", await AyrA.ping());
	} catch (e) { }
})();

