from PIL import Image

INPUT = "public/hidden-signal.png"
OUTPUT = "public/hidden-signal.png"

FLAG = "FLAG{signals_hide_in_plain_sight}"


def hide_message(image_path, output_path, message):
    image = Image.open(image_path).convert("RGB")

    # Add a delimiter so extraction knows where the message ends
    message += "<<<END>>>"

    # Convert every character into 8 bits
    bits = ""
    for char in message:
        bits += format(ord(char), "08b")

    pixels = list(image.getdata())

    if len(bits) > len(pixels) * 3:
        raise ValueError("Image is too small for this message.")

    new_pixels = []
    bit_index = 0

    for pixel in pixels:
        r, g, b = pixel
        channels = [r, g, b]

        for i in range(3):
            if bit_index < len(bits):
                # Replace the least significant bit
                channels[i] = (channels[i] & ~1) | int(bits[bit_index])
                bit_index += 1

        new_pixels.append(tuple(channels))

    image.putdata(new_pixels)
    image.save(output_path)

    print("Flag successfully hidden!")
    print(f"Output: {output_path}")


hide_message(INPUT, OUTPUT, FLAG)