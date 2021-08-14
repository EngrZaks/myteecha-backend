const home = (req, res) => {
  const ipaddress = req.remoteAddress;
  res.send("welcome to MyTeecha app backend");
  console.log(ipaddress);
};
module.exports = home;
