function(instance, properties, context) {
    // ✅ Load input properties
    const link = properties.link || "https://bubble.io"; // Default to Bubble.io if no link is provided
    const logoUrl = properties.logo || null; // Optional logo

    // ✅ Create a QR code container
    const qrContainer = document.createElement("div");

    // ✅ Generate the QR code
    const qrCode = new QRCode(qrContainer, {
        text: link,
        width: 300, // QR code size
        height: 300,
        colorDark: "#3968E2", // Blue color
        colorLight: "#FFFFFF", // White background
        correctLevel: QRCode.CorrectLevel.H // High error correction
    });

    setTimeout(() => {
        // ✅ Extract the QR code image
        const qrCanvas = qrContainer.querySelector("canvas");
        if (!qrCanvas) {
            console.error("QR Code generation failed.");
            return;
        }

        let qrImage = qrCanvas.toDataURL("image/png");

        if (logoUrl) {
            const logoImg = new Image();
            logoImg.src = logoUrl;
            logoImg.crossOrigin = "anonymous"; // Prevent CORS issues

            logoImg.onload = function() {
                const canvas = document.createElement("canvas");
                canvas.width = qrCanvas.width;
                canvas.height = qrCanvas.height;
                const ctx = canvas.getContext("2d");

                // ✅ Draw the QR code
                ctx.drawImage(qrCanvas, 0, 0);

                // ✅ Overlay the logo at the center
                const logoSize = qrCanvas.width * 0.2; // 20% of QR code size
                const x = (qrCanvas.width - logoSize) / 2;
                const y = (qrCanvas.height - logoSize) / 2;
                ctx.drawImage(logoImg, x, y, logoSize, logoSize);

                // ✅ Convert to Base64 PNG
                qrImage = canvas.toDataURL("image/png");

                // ✅ Publish the QR code image URL as a state
                instance.publishState("qr_code_image", qrImage);
                instance.triggerEvent("qr_code_generated");
            };

            logoImg.onerror = function() {
                console.error("Failed to load logo image.");
                instance.publishState("qr_code_image", qrImage); // Return QR without logo
                instance.triggerEvent("qr_code_generated");
            };

        } else {
            // ✅ No logo, directly publish the QR code image
            instance.publishState("qr_code_image", qrImage);
            instance.triggerEvent("qr_code_generated");
        }
    }, 500);
}
