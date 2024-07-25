const fs = require('fs');
const path = require('path');

exports.unlink=async (link)=> {
    const oldPath = path.join(__dirname, link);
    console.log(oldPath)
    // Kiểm tra xem tệp có tồn tại hay không, sau đó xóa nó
    if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error(`Failed to delete old profile picture: ${err.message}`);
            } else {
                console.log(`Old profile picture deleted: ${oldPath}`);
            }
        });
    }
} 

