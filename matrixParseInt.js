exports.parseInt = A => A.map(v => v|0);

exports.parseUInt = A => A.map(v => v<0?0:(v|0));

exports.parseUInt8 = A => A.map(v => v<0?0:(v>255?255:(v|0)));
