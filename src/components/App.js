import React from 'react';
import config from '../config.json';
import { addCVs, openCurrentCVFolder } from '../services/services';
import './App.css';
import ResultItem from './ResultItem';
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  ToggleButton,
  MultiDataList
} from '@appbaseio/reactivesearch';
import { DndProvider } from 'react-dnd';
import DnDBox from './DnDBox';
import { HTML5Backend } from 'react-dnd-html5-backend';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
  }

  onDnDProviderClick = async () => {
    // const { filePaths } = await dialog.showOpenDialog({
    //   title: "Add CVs to CVtheque",
    //   buttonLabel: "Add CVs",
    //   filters: [
    //     { name: 'CVs', extensions: ['doc', 'docx', 'pdf'] }
    //   ],
    //   properties: ['openFile', 'multiSelections']
    // })
    // addCVs(filePaths);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="dnd">
            <DndProvider backend={HTML5Backend}>
              <div onClick={this.onDnDProviderClick}>
                <DnDBox />
              </div>
            </DndProvider>
          </div>

          <ReactiveBase
            app={config.ELASTICSEARCH_INDEX}
            url={config.ELASTICSEARCH_URL}
            transformResponse={async (resp, componentId) => {
              const keyWords = this.state.value ? this.state.value.replace(/\\(.)/g, "$1").replace(/\*|\(|\)/g, ' ').replace(/ \+ | \| /g, ' ').split(' ').map(el => el.trim()) : [];
              resp.hits.hits = resp.hits.hits.map((item) => {
                const contentLowerCase = item._source.content ? item._source.content.toLowerCase() : '';
                const existsKeyword = keyWords.reduce((acc, curr) => { return Object.assign(acc, { [curr]: contentLowerCase.includes(curr.toLowerCase()) }) }, {})
                return {
                  ...item,
                  existsKeyword: existsKeyword
                };
              });
              return resp;
            }}

          >

            <div className="toggle">
              <ToggleButton
                componentId="StateFilter"
                dataField="cvtheque.state"
                data={
                  [{ "label": "Vivier", "value": "vivier" },
                  { "label": "Contactés", "value": "contact" },
                  { "label": "À Relancer", "value": "relance" }]
                }
                defaultValue={["contact"]}
                multiSelect={false}
                innerClass={{
                  button: 'toggle-button'
                }}
              />
            </div>

            <div className="mdl">
              <MultiDataList
                title=""
                componentId="FolderFilter"
                dataField="path.virtual"
                data={
                  [{
                    label: "Chasse",
                    value: "*08\\ CV\\ CHASSE*"
                  }, {
                    label: "Actifs",
                    value: "*01\\ ACTIFS\\ DERNIERES\\ VERSIONS*"
                  }]
                }
                customQuery={
                  (value, props) => {
                    if (Array.isArray(value)) {
                      const v = value.map(el => '(' + el + ')').join(" OR ");
                      return {
                        query: {
                          query_string: {
                            fields: [props.dataField],
                            query: v
                          }
                        }
                      }
                    }
                  }
                }
                innerClass={{
                  checkbox: 'mdl-checkbox',
                  label: 'mdl-label'
                }}
                showSearch={false}
                showCheckbox={true}
                showCount={true}
                defaultValue={["Chasse", "Actifs PN"]}
              />
            </div>

            <DataSearch
              componentId="SearchBar"
              dataField={['content']}
              autosuggest={false}
              defaultSuggestions={
                [{ label: "java", value: "java" },
                { label: "C\\+\\+", value: "C\\+\\+" },
                { label: "java + git", value: "java + git" },
                { label: "(c# + svn) | (c\\+\\+ + svn)", value: "(c# + svn) | (c\\+\\+ + svn)" },
                { label: "dev* + architect*", value: "dev* + architect*" },
                { label: "thales + mbda", value: "thales + mbda" },
                { label: "colombo*", value: "colombo*" }
                ]}
              fuzziness={0}
              searchOperators={true}
              queryFormat="or"
              highlight
              customHighlight={(props) => ({
                highlight: {
                  fields: {
                    content: {
                      fragment_size: 200,
                      number_of_fragments: 3
                    }
                  }
                },
              })}
              renderError={(error) => (
                <div>
                  Something went wrong!<br />Error details<br />{error}
                </div>
              )}
              value={this.state.value}
              onChange={(value, triggerQuery, event) => { this.setState({ value: value }); }}
              onKeyDown={(e, triggerQuery, event) => {
                if (e.key === 'Enter') {
                  triggerQuery();
                }
              }}
            />

            <ReactiveList
              innerClass={{
                pagination: 'pagination'
              }}
              componentId="SearchResult"
              dataField="content"
              size={15}
              className="result-list-container"
              pagination
              URLParams
              react={{
                and: ["StateFilter", "SearchBar", "FolderFilter"]
              }}
              renderNoResults={() => {
                return (
                  <div className="noresult">
                    <br />
                    <button onClick={() => { openCurrentCVFolder() }} >
                      Ajouter des CVs
                    </button>
                    <br />
                    <br />
                    <div>
                      La base de données est mise à jour toutes les 5 secondes
                  </div>
                    <br />
                    <br />
                  </div>
                )
              }}
              renderResultStats={(stats) => {
                return (
                  <div className="stats">
                    Showing {stats.displayedResults} on {stats.numberOfResults} CVs found in {stats.time} ms
                  </div>
                )
              }}
              render={({ data }) => {
                return (
                  < ReactiveList.ResultListWrapper >
                    {data.map((cvItem) => {
                      return (
                        <ResultItem cvItem={cvItem}></ResultItem>
                      )
                    })}
                  </ReactiveList.ResultListWrapper>
                )
              }}
            />
          </ReactiveBase>
        </header>
      </div >
    )
  }
}

export default App;