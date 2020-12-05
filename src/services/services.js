import config from '../config.json';
import moment from 'moment';
import elasticsearch from 'elasticsearch';

const esClient = new elasticsearch.Client({
    host: config.ELASTICSEARCH_URL,
    apiVersion: '7.4',
});

const addCVs = (filesPath) => {
    //add to bucket
}

const deleteCV = (cvItem) => {
    try {
        //delete in bucket
        esClient.delete({
            index: config.ELASTICSEARCH_INDEX,
            type: '_doc',
            id: cvItem._id,
            refresh: true
        });
    } catch (error) {
        console.error(error);
    }
}

const updateState = (cvItem, newState) => {
    try {
        esClient.update({
            index: config.ELASTICSEARCH_INDEX,
            type: '_doc',
            id: cvItem._id,
            refresh: true,
            body: {
                doc: {
                    cvtheque: {
                        state: newState
                    }
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const updateComment = (cvItem, newComment) => {
    try {
        esClient.update({
            index: config.ELASTICSEARCH_INDEX,
            type: '_doc',
            id: cvItem._id,
            refresh: true,
            body: {
                doc: {
                    cvtheque: {
                        comment: newComment
                    }
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const openCV = (cvItem) => {
    //ouvrir dans un nouvel onglet
}

const printCV = (cvItem) => {
    //imprimer
}

const showCVInExplorer = (cvItem) => {
    //chemin dans le s3 bucket
}

const openMailWithCVAttached = (cvItem) => {
    //mettre le cv en pj dans gmail
}

const openCurrentCVFolder = () => {

}

export {
    addCVs,
    deleteCV,
    updateState,
    updateComment,
    openCV,
    printCV,
    showCVInExplorer,
    openMailWithCVAttached,
    openCurrentCVFolder
}