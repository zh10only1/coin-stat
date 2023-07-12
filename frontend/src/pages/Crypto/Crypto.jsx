import Loader from "../../components/Loader/Loader";
import { getCryptoData } from "../../api/external";
import styles from "./Crypto.module.css";

import { useState, useEffect } from "react";

function Crypto() {
    const [data, setData] = useState([]);

    useEffect(() => {
        (async function cryptoApiCall() {
            const response = await getCryptoData();
            
            if(response.code !== "ERR_NETWORK") {
                setData(response.data);
            }
        })();

        setData([]);
    }, []);

    if (data.length === 0) {
        return <Loader text="Cryptocurrency Data" />;
    }

    return (
        <>
            <div className={styles.header}> Top Ranked Cryptocurrencies </div>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Coin</th>
                        <th>Symbol</th>
                        <th>Current Price</th>
                        <th>Price change 24h</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((coin) => (
                        <tr key={coin.id}>
                            <td>{coin.market_cap_rank}</td>
                            <td>
                                <div className={styles.CryptoLogo}>
                                    <img src={coin.image} alt="" width={40} height={40} />
                                    <h4>{coin.name}</h4>
                                </div>
                            </td>
                            <td>
                                <div className={styles.CryptoSymbol}>{coin.symbol}</div>
                            </td>
                            <td>{coin.current_price}</td>
                            <td
                                style={
                                    coin.price_change_percentage_24h > 0
                                        ? { color: "#16c784" }
                                        : { color: "#ea3943" }
                                }
                            >
                                {coin.price_change_percentage_24h}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Crypto;
