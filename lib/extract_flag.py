from PIL import Image

IMAGE = "public/hidden-signal.png"


def extract_message(image_path):
    image = Image.open(image_path).convert("RGB")

    bits = ""

    for pixel in image.getdata():
        for channel in pixel:
            bits += str(channel & 1)

    message = ""

    for i in range(0, len(bits), 8):
        byte = bits[i:i + 8]

        if len(byte) < 8:
            break

        char = chr(int(byte, 2))
        message += char

        if message.endswith("<<<END>>>"):
            break

    print("Extracted message:")
    print(message.replace("<<<END>>>", ""))


extract_message(IMAGE)