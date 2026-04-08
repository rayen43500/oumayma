import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import api from "../services/api";
Chart.register(...registerables);

// Couleurs et icônes par produit
const PRODUCT_STYLES = [
  { color: "#e74c3c", bg: "#fdecea", emoji: "🍅" },
  { color: "#e67e22", bg: "#fef0e6", emoji: "🥕" },
  { color: "#27ae60", bg: "#e9f7ef", emoji: "🥗" },
  { color: "#8e44ad", bg: "#f4ecf7", emoji: "🧅" },
  { color: "#e74c3c", bg: "#fdecea", emoji: "🫑" },
];

const DONUT_COLORS = ["#27ae60", "#e67e22", "#e91e8c", "#8e44ad", "#888780"];

export default function TopProduitsStats() {
  const donutRef   = useRef(null);
  const donutChart = useRef(null);

  const [produits, setProduits] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les commandes pour calculer les ventes par produit
        const ordersRes = await api.get("/commandes");
        let orders = ordersRes.data;
        if (orders.data) orders = orders.data;
        if (!Array.isArray(orders)) orders = [];

        // Calculer les ventes par produit
        const salesByProduct = {};
        
        orders.forEach(order => {
          // La structure correct est order.produits
          if (order.produits && Array.isArray(order.produits)) {
            order.produits.forEach(item => {
              const productName = item.nom || item.name || `Product ${item.id}`;
              const quantity = item.quantite || item.quantity || 1;
              salesByProduct[productName] = (salesByProduct[productName] || 0) + quantity;
            });
          }
        });

        // Convertir en array et trier par ventes décroissantes
        const topProducts = Object.entries(salesByProduct)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5); // Prendre top 5

        // Calculer les pourcentages
        const totalQty = topProducts.reduce((sum, p) => sum + p.quantity, 0);
        const normalizedData = topProducts.map(p => ({
          ...p,
          pct: totalQty > 0 ? Math.round((p.quantity / totalQty) * 100) : 0
        }));

        setProduits(normalizedData);

        // ── Donut Chart ──
        if (donutRef.current) {
          if (donutChart.current) donutChart.current.destroy();
          donutChart.current = new Chart(donutRef.current, {
            type: "doughnut",
            data: {
              labels: normalizedData.map(p => p.name),
              datasets: [{
                data:            normalizedData.map(p => p.pct),
                backgroundColor: DONUT_COLORS,
                borderWidth:     0,
                hoverOffset:     6,
              }],
            },
            options: {
              responsive:          true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` ${ctx.label} : ${ctx.parsed}%`,
                  },
                },
              },
              cutout: "68%",
            },
          });
        }

      } catch (err) {
        console.error(err);
        setError("Erreur chargement données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => { donutChart.current?.destroy(); };
  }, []);

  if (loading) return (
    <div style={styles.center}>
      <p style={{ color: "#aaa", fontSize: 13 }}>Chargement...</p>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p>
    </div>
  );

  return (
    <div style={styles.wrapper}>

      {/* ── FIGURE GAUCHE : Top produits avec barres ── */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>Produits les plus vendus</p>

        {produits.map((p, i) => {
          const style = PRODUCT_STYLES[i] || PRODUCT_STYLES[0];
          return (
            <div key={`product-${i}`} style={styles.productRow}>

              {/* Nom + barre */}
              <div style={styles.productInfo}>
                <div style={styles.productNameRow}>
                  <span style={styles.productName}>{p.name}</span>
                  <span style={styles.productPct}>{p.pct}%</span>
                </div>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.barFill,
                    width:      `${p.pct}%`,
                    background: style.color,
                  }} />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ── FIGURE DROITE : Donut chart ── */}
      <div style={styles.card}>
        <p style={styles.cardTitle}>Répartition des ventes</p>

        {/* Donut */}
        <div style={{ position: "relative", height: 200 }}>
          <canvas ref={donutRef}></canvas>
        </div>

        {/* Légende */}
        <div style={styles.legend}>
          {produits.map((p, i) => (
            <span key={`legend-${i}`} style={styles.legendItem}>
              <span style={{
                ...styles.legendDot,
                background: DONUT_COLORS[i] || "#888",
              }} />
              {p.name} {p.pct}%
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Styles ──
const styles = {
  wrapper: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 16,
    padding:             "1.5rem",
  },
  card: {
    background:   "#e8e8e8",
    borderRadius: 12,
    padding:      "1.25rem",
  },
  cardTitle: {
    fontSize:    14,
    fontWeight:  500,
    color:       "#333333",
    margin:      "0 0 16px",
  },
  productRow: {
    display:       "flex",
    alignItems:    "center",
    gap:           12,
    marginBottom:  14,
  },
  iconBox: {
    width:        36,
    height:       36,
    borderRadius: 8,
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    flexShrink:   0,
  },
  productInfo: {
    flex: 1,
  },
  productNameRow: {
    display:        "flex",
    justifyContent: "space-between",
    marginBottom:   4,
  },
  productName: {
    fontSize: 13,
    color:    "#333333",
  },
  productPct: {
    fontSize:   12,
    color:      "#666666",
    fontWeight: 500,
  },
  barTrack: {
    width:        "100%",
    height:       5,
    background:   "#d0d0d0",
    borderRadius: 3,
  },
  barFill: {
    height:       "100%",
    borderRadius: 3,
    transition:   "width 0.5s ease",
  },
  legend: {
    display:    "flex",
    flexWrap:   "wrap",
    gap:        10,
    marginTop:  14,
    fontSize:   12,
    color:      "#666666",
  },
  legendItem: {
    display:     "flex",
    alignItems:  "center",
    gap:         5,
  },
  legendDot: {
    width:        10,
    height:       10,
    borderRadius: 2,
    display:      "inline-block",
  },
  center: {
    padding:   "2rem",
    textAlign: "center",
  },
};
