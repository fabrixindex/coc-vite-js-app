import { useEffect } from "react";
import { getClanData } from "../../Services/ConnectAPI.js";

const DEFAULT_TITLE = "Panel de Control";

// Componente sin UI: solo actualiza el <title> de la pestaña con el nombre
// real del clan, traído en vivo desde la API. Se monta una sola vez, arriba
// del todo en App.jsx, para que persista en todas las rutas.
function DocumentTitleUpdater() {
    useEffect(() => {
        let isMounted = true;

        async function updateTitle() {
            try {
                const clan = await getClanData();
                if (isMounted && clan?.name) {
                    document.title = `${DEFAULT_TITLE} | ${clan.name}`;
                }
            } catch (error) {
                console.error('Error al actualizar el título de la página:', error);
                // Si falla, se queda con el título estático de index.html
            }
        }

        updateTitle();

        return () => {
            isMounted = false;
        };
    }, []);

    return null;
}

export default DocumentTitleUpdater;
