import Avatar from "@mui/material/Avatar";

export default function BackgroundLetterAvatars({ name, size }) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name, size) {
    return {
      sx: {
        bgcolor: name ? stringToColor(name) : "#ccc", // backgroung color light grey if no name
        width: size,
        height: size,
        fontSize: size / 2,
        fontWeight: "bold",
      },
      children: name
        ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
        : null,
    };
  }

  // Extract the first two characters from the email before the "@" symbol, convert to uppercase, and add spaces in between
  const result = name
    .split("@")[0]
    .slice(0, 2)
    .split("")
    .join(" ")
    .toUpperCase();

  return <Avatar {...stringAvatar(result, size)} />;
}
