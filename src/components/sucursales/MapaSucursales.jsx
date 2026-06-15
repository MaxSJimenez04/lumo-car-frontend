import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const pinRojo = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="#ef4444"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    className: "",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
})

export default function MapaSucursales({ sucursales, onSeleccionar, seleccionada }) {
    const centro = sucursales.length > 0
        ? [sucursales[0].latitud, sucursales[0].longitud]
        : [23.6345, -102.5528]

    return (
        <MapContainer
            center={centro}
            zoom={13}
            className="mapa-sucursales"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {sucursales.map((s) => (
                <Marker
                    key={s.idSucursal}
                    position={[s.latitud, s.longitud]}
                    icon={pinRojo}
                    eventHandlers={{ click: () => onSeleccionar(s) }}
                >
                    <Popup>
                        <strong>{s.nombre}</strong><br />
                        {s.direccion}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
