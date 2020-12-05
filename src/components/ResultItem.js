import React from 'react';
import './App.css';
import { formatDate } from '../services/utils';
import {
    openCV,
    showCVInExplorer,
    openMailWithCVAttached,
    printCV,
    updateState,
    deleteCV,
    updateComment
} from '../services/services';
import { ResultList } from '@appbaseio/reactivesearch';

const deleteCVIfExists = async (cvItem) => {
    // if (fs.existsSync(cvItem.path.real)) {
    //     const { response } = await dialog.showMessageBox({
    //         type: "question",
    //         buttons: ["Yes", "Cancel"],
    //         title: "Delete CV",
    //         message: "Are you sure you want to delete this CV?"
    //     })
    //     if (response === 0) {
    //         deleteCV(cvItem);
    //     }
    // }
}

const ResultItem = (props) => {

    const { cvItem } = props;
    const title = cvItem.path.real.split('\\').pop();
    const etat = cvItem.cvtheque && cvItem.cvtheque.state ? cvItem.cvtheque.state : "vivier";

    return (
        <ResultList key={cvItem._id} >
            <ResultList.Content className={"cvItem " + etat} >
                <ResultList.Title>
                    <div dangerouslySetInnerHTML={{ __html: title }} />
                    <div className="subtitle">ajouté le {formatDate(cvItem.file.indexing_date)}</div>
                </ResultList.Title>
                <ResultList.Description >
                    <div className="cvItemButton">
                        <button className="action tooltip" onClick={() => { openCV(cvItem) }} ><i className="fa fa-user"></i><span className="tooltiptext">Ouvrir</span></button>&nbsp;
                        <button className="action tooltip" onClick={() => { showCVInExplorer(cvItem) }} ><i className="fa fa-arrow-up"></i><span className="tooltiptext">Ouvrir l'emplacement</span></button>&nbsp;
                        <button className="action tooltip" onClick={() => { openMailWithCVAttached(cvItem) }} ><i className="fa fa-envelope" /><span className="tooltiptext">Joindre dans un nouveau mail</span></button>&nbsp;
                        <button className="action tooltip" onClick={() => { printCV(cvItem) }} ><i className="fa fa-print" /><span className="tooltiptext">Imprimer</span></button>&nbsp;
                                &nbsp;&nbsp;&nbsp;
                        {etat !== 'vivier' ? <button className="vivier tooltip" onClick={() => { updateState(cvItem, "vivier"); }} ><i className="fa fa-database" /><span className="tooltiptext">Déplacer dans Vivier</span></button> : null}{etat !== 'vivier' ? <span>&nbsp;</span> : null}
                        {etat !== 'contact' ? <button className="contact tooltip" onClick={() => { updateState(cvItem, "contact") }} ><i className="fa fa-phone" /><span className="tooltiptext">Déplacer dans Contactés</span></button> : null}{etat !== 'contact' ? <span>&nbsp;</span> : null}
                        {etat !== 'relance' ? <button className="relance tooltip" onClick={() => { updateState(cvItem, "relance") }} ><i className="fa fa-calendar" /><span className="tooltiptext">Déplacer dans À Relancer</span></button> : null}{etat !== 'relance' ? <span>&nbsp;</span> : null}
                        &nbsp;&nbsp;&nbsp;
                        <button className="delete tooltip" onClick={() => { deleteCVIfExists(cvItem) }} ><i className="fa fa-trash" /><span className="tooltiptext">Supprimer</span></button>
                    </div>

                    <div className="cvItemComment" dangerouslySetInnerHTML={{ __html: cvItem.cvtheque && cvItem.cvtheque.comment ? cvItem.cvtheque.comment : '' }} suppressContentEditableWarning={true} contentEditable={true} onBlur={(e) => { updateComment(cvItem, e.target['innerHTML']) }}></div>

                    {cvItem.highlight.content ?
                        <div className="cvItemSearchResults">
                            <div >{cvItem._score}</div>
                            <div >
                                {Object.keys(cvItem.existsKeyword).map(el => (<span><span className={cvItem.existsKeyword[el] ? '' : 'barre'}>{el}</span><span>{' '}</span></span>))}
                            </div>
                            {cvItem.highlight.content.map((hilight) => (
                                <div className="highlight" dangerouslySetInnerHTML={{ __html: hilight }} />
                            ))}
                        </div>
                        : null}
                </ResultList.Description>
            </ResultList.Content>
        </ResultList>
    )
}
export default ResultItem