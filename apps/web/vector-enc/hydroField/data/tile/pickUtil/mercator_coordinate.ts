export const earthRadius = 6371008.8
export const earthCircumference = 2 * Math.PI * earthRadius
export const MAX_MERCATOR_LATITUDE = 85.051129

class MercatorCoordinate {
	static mercatorXfromLng(lng: number) {
		return (180 + lng) / 360
	}

	static mercatorYfromLat(lat: number) {
		return (180 - (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) / 360
	}

	static fromLngLat(lngLat: Array<number>) {
		const x = MercatorCoordinate.mercatorXfromLng(lngLat[0])
		const y = MercatorCoordinate.mercatorYfromLat(lngLat[1])

		// ？？？？？
		// x = x * 2.0 - 1.0
		// y = 1.0 - y * 2.0

		return [x, y]
	}

	static lngFromMercatorX(x: number) {
		return x * 360.0 - 180.0
	}

	static latFromMercatorY(y: number) {
		const y2 = 180.0 - y * 360.0
		return (360.0 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180.0)) - 90.0
	}

	static fromXY(xy: Array<number>) {
		const [x, y] = xy
		const lng = MercatorCoordinate.lngFromMercatorX((1.0 + x) / 2.0)
		const lat = MercatorCoordinate.latFromMercatorY((1.0 - y) / 2.0)
		return [lng, lat]
	}

	static circumferenceAtLatitude(latitude: number): number {
		return earthCircumference * Math.cos((latitude * Math.PI) / 180)
	}

	static mercatorZfromAltitude(altitude: number, lat: number): number {
		return altitude / this.circumferenceAtLatitude(lat)
	}

	static altitudeFromMercatorZ(z: number, y: number): number {
		return z * this.circumferenceAtLatitude(this.latFromMercatorY(y))
	}
}

export default MercatorCoordinate
