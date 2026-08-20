<div align="center">

![Cúpula del Clan](https://i.imgur.com/AZwwkCo.jpg)

# ⚔️ Panel de control para clanes de Clash of Clans

Guerra, Liga de Guerra, Capital del Clan, donaciones, rankings y perfiles de jugador — todo en un solo lugar, con estadísticas en vivo y mensajes listos para copiar y pegar en WhatsApp.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![JavaScript](https://camo.githubusercontent.com/dc050359857b187d9f7a075b1a03dccb9606b32b30f3178a1ba5973ac17d1c08/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6a6176617363726970742d2532333332333333302e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661736372697074266c6f676f436f6c6f723d253233463744463145)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Clash of Clans API](https://img.shields.io/badge/Clash%20of%20Clans%20API-000000?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0Y1RDAwMCI%2BPHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIvPjwvc3ZnPg%3D%3D)](https://developer.clashofclans.com/)

</div>

---

## 📋 Tabla de contenidos

- [¿Qué es esto?](#-qué-es-esto)
- [Capturas](#-capturas)
- [Características](#-características)
- [Diseño](#-diseño)
- [Stack tecnológico](#️-stack-tecnológico)
- [Empezar](#-empezar)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Roadmap](#️-roadmap)
- [Aviso legal](#️-aviso-legal)

---

## 🧭 ¿Qué es esto?

**Cúpula del Clan** es una aplicación web hecha con React + Vite que consume la [API oficial de Clash of Clans](https://developer.clashofclans.com/) para darle a la cúpula de un clan (líderes, co-líderes, ancianos) un panel centralizado donde:

- Seguir la guerra actual, la Liga de Guerra de Clanes y los asaltos de la Capital en tiempo real.
- Detectar automáticamente jugadores que no cumplieron con las reglas del clan (ataques, espejos, donaciones).
- Generar mensajes prolijos, con formato y emojis, listos para copiar y pegar directo en el grupo de WhatsApp del clan — recordatorios, sanciones, cierres de guerra, cambios de ronda, resultados de liga, y más.
- Ver el perfil completo de cualquier jugador: héroes, tropas, hechizos, logros, estadísticas de Liga de Leyendas.
- Comparar el clan contra otros clanes y jugadores de la región en los rankings.

Nació como una herramienta interna para un clan puntual, pero está pensada para poder adaptarse a cualquier clan cambiando la configuración.

---

## ✨ Características

### 🛡️ Nuestro Clan
- Perfil completo del clan: escudo, descripción, labels con sus íconos reales (Clan Wars, CWL, Clan Games), ubicación con bandera dinámica según el país.
- Récord de guerra del clan con barra de % de victorias y racha actual.
- Roster completo de miembros en tarjetas, con color según el rol (líder, co-líder, anciano, miembro) y flecha de tendencia (▲/▼) comparando la posición actual del jugador en el clan contra la anterior.

### ⚔️ Guerra Actual
- Panel de batalla estilo "VS" con ambos clanes, nivel, estrellas y % de destrucción.
- Comparativa visual con barras (estrellas y destrucción) entre nuestro clan y el rival.
- "Mejor atacante de la guerra", calculado automáticamente.
- Tarjetas de cada jugador con color según rendimiento (verde/amarillo/rojo) y detalle de cada ataque, incluyendo si atacó a su espejo.
- Generador de mensajes para WhatsApp:
  - 🔔 Recordatorio de 1er/2do ataque (solo a quienes les falta).
  - ⚠️ Lista de sanciones automática, según las reglas del clan (espejo, 2do ataque, expulsión, excepción de guerra perfecta).
  - 🏆 Cierre de guerra (ganada/perdida/empatada).
  - 🔍 Búsqueda de guerra iniciada.
  - 📝 Apertura de registro para la próxima guerra.

### 🏆 Liga de Guerra de Clanes (CWL)
- Selector de las 7 rondas de la liga — navegá cualquier ronda ya jugada, no solo la actual.
- Tarjetas de **ataques** y de **defensas** por separado, coloreadas según el resultado.
- Estadísticas de la liga: récord, estrellas totales, destrucción promedio, ranking de mejores atacantes y defensores con barras.
- Generador de **cambios de ronda**: elegís quién sale (ordenado automáticamente de peor a mejor rendimiento) y quién entra del resto del roster, y arma el mensaje.
- En la última ronda: generador de **mejores jugadores de la liga** (top 5, con menciones) y de **bonus de liga** (lista numerada de quienes califican).
- Generador de **resultado final de la liga** con el puesto obtenido.

### ☁️ Capital del Clan
- Progreso de cada jugador como una medalla circular (X de 6 asaltos), en vez de un simple ícono.
- Estadísticas del fin de semana: completados, ausentes, % de participación.
- Lista ordenada de quién falta atacar, con mensaje listo para copiar.

### 🤝 Donaciones
- Cada jugador con dos barras (donado / recibido) para ver de un vistazo la proporción y la magnitud.
- Color automático según el balance: dona igual o más de lo que recibe (verde), dona la mitad o más (amarillo), dona menos de la mitad (rojo).
- Generador de lista de jugadores desequilibrados, ordenada por gravedad.

### 📊 Rankings
- Ranking de clanes y jugadores de Argentina (con la temática celeste y blanca de la bandera).
- Ranking de jugadores de México (verde/blanco/rojo).
- Medallas 🥇🥈🥉 para el top 3, y el clan propio resaltado si aparece en el ranking.

### 👤 Perfil de jugador
- Estadísticas principales, donaciones, récord de guerra individual.
- Estadísticas de Liga de Leyendas (si el jugador llegó alguna vez).
- Progreso de héroes (aldea principal y de constructor) con barra por héroe.
- % de tropas, hechizos y equipo de héroe al nivel máximo.
- Logros: puntaje total de estrellas y lista de los que faltan completar, ordenados por cercanía a terminarlos.

---

## 🎨 Diseño

Toda la app comparte un mismo sistema visual, pensado para que cada sección se sienta parte de un mismo producto:

- **Tipografía**: [Rajdhani](https://fonts.google.com/specimen/Rajdhani) para títulos y números, fuente de sistema para texto de lectura.
- **Paleta**: fondo azul-navy oscuro, tarjetas con acentos dorados, y un mismo código de color reutilizado en toda la app — verde (bien), amarillo (atención), rojo (mal) — para ataques, defensas, donaciones y asaltos.
- **Componentes reutilizados**: barras de progreso, tarjetas con borde de color según estado, modales con botón de copiar, botones con degradado e ícono propio por acción.
- Identidades propias por sección cuando tiene sentido (colores de bandera en Rankings, medallas circulares en Capital del Clan) sin romper la coherencia general.

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| [React](https://react.dev/) | Librería de UI |
| [Vite](https://vitejs.dev/) | Build tool y dev server |
| [React Router](https://reactrouter.com/) | Ruteo entre secciones |
| [react-icons](https://react-icons.github.io/react-icons/) | Íconos (navbar) |
| CSS puro | Sin frameworks de estilos — diseño propio |
| [Clash of Clans API](https://developer.clashofclans.com/) | Fuente de todos los datos del clan, jugadores y liga |

---

## 🚀 Empezar

### Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Un backend/proxy propio que hable con la API de Clash of Clans (la API oficial no permite llamadas directas desde el navegador por IP fija — este proyecto asume que `Services/ConnectAPI.js` apunta a tu propio servidor intermedio)

### Instalación

```bash
git clone https://github.com/fabrixindex/coc-vite-js-app.git
cd coc-vite-js-app
npm install
```

### Variables de entorno

Creá un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://tu-backend.com/api
```

> Ajustá el nombre y el uso de esta variable según cómo esté armado tu `Services/ConnectAPI.js`.

### Scripts disponibles

```bash
npm run dev       # levanta el servidor de desarrollo
npm run build     # genera el build de producción
npm run preview   # sirve el build de producción localmente
```

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Home/
│   ├── Navbar/
│   ├── Loader/
│   ├── CurrentWar/
│   ├── ClanWarLeague/
│   ├── CurrentCapitalRaid/
│   ├── CurrentCapitalRaidList/
│   ├── CurrentCapitalRaidContainer/
│   ├── CheckDonations/
│   ├── Rankings/
│   ├── RankingClanArg/
│   ├── RankingPlayerArg/
│   ├── RankingPlayerMx/
│   ├── ClanAndMembers/
│   ├── Member/
│   ├── MemberList/
│   ├── MemberListContainer/
│   ├── MemberDetail/
│   ├── MemberDetailList/
│   ├── MemberDetailContainer/
│   └── DocumentTitleUpdater/
├── Services/
│   └── ConnectAPI.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## 🗺️ Roadmap

Ideas para seguir mejorando:

- [ ] Estado global de guerra/liga con caché, para no repetir fetches al navegar entre secciones.
- [ ] Historial de guerras pasadas (no solo la actual).
- [ ] Notificaciones push para recordatorios de ataque.
- [ ] Modo claro / oscuro configurable.
- [ ] Exportar estadísticas a PDF.

---

## ⚠️ Aviso legal

Esta app no está afiliada, respaldada, patrocinada ni aprobada específicamente por Supercell, y Supercell no es responsable de ella. Para más información, consultá la [Política de Contenido de Fans de Supercell](https://supercell.com/en/fan-content-policy/).

Clash of Clans es una marca registrada de Supercell Oy.

