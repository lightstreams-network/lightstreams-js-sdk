module.exports.panic = (msg) => {
  console.error(msg);
  process.exit(1);
};
