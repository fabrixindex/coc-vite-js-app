import RankingClanArg from "../RankingClanArg/RankingClanArg.jsx";
import RankingPlayerArg from "../RankingPlayerArg/RankingPlayerArg.jsx";
import RankingPlayerMex from "../RankingPlayerMx/RankingPlayerMx.jsx";
import "./Rankings.css"

function Rankings() {
    return (
        <>
            <div className="ranking-container-1">
                <div>
                    <h1 className="clan-arg-container-text">RANKING DE CLANES ARGENTINA</h1>
                </div>
                
                <RankingClanArg/>
            </div>

            <div className="ranking-container-2">
                <RankingPlayerArg/>

                <div>
                    <h1 className="arg-player-container-text">RANKING <br /> DE PLAYERS ARGENTINA</h1>
                </div>
            </div>

            <div className="ranking-container-3">

                <div>
                    <h1 className="mex-player-container-text">RANKING <br /> DE PLAYERS MEXICO</h1>
                </div> 

                <RankingPlayerMex/>
            </div>
        </>
    );
}

export default Rankings;
