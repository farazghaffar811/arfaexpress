exports.getDeviceStatus = (req, res) => {
  // Dummy example — in real use SDK/device detection logic
  res.json({ deviceId: 'DEVICE_001', status: 'connected' });
};
