
class CookieSaver {
	// 序列化对象到cookie
	public serializeObjectToCookie(key: string, obj: any): void {
		const serializedObj = JSON.stringify(obj);
		document.cookie = `${key}=${encodeURIComponent(serializedObj)}`;
	}

	// 从cookie中反序列化对象
	public deserializeObjectFromCookie(key: string): any | null {
		const cookieValue = document.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith(`${key}=`));

		if (cookieValue) {
			const serializedObj = decodeURIComponent(cookieValue.split('=')[1]);
			return JSON.parse(serializedObj);
		}
		return null;
	}

}

export default CookieSaver;