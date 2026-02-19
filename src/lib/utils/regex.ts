export const pgnRegex =
	/\[(\w+)\s+"([^"]+)"\]|\{([^}]*)\}|(\d+\.+)|(1-0|0-1|1\/2-1\/2)|([KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[QRBN])?[+#]?|O-O(?:-O)?)/g
export const sanRegex =
	/^([KQRBN])?([a-h])?([1-8])?x?([a-h][1-8])(=[QRBN])?(\+|#)?$/
