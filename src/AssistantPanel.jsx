import { Children, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Select from "react-select";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Button,
} from "@chatscope/chat-ui-kit-react";
import {
  useChat,
  ChatMessage,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  MessageContent,
  TextContent,
  User,
} from "@chatscope/use-chat";
import { lightBlue } from "@mui/material/colors";

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

Button.defaultProps = {
  theme: "blue",
  
};

// import { Spinner } from "@nextui-org/spinner";

export const AssistantPanel = ({ useMT, toggleUseMT }) => {
  const [messages, updateMessages] = useState(undefined);
  const [currentMessage, updateCurrentChat] = useState(undefined);
  const [selectedModel, updateModelSelection] = useState(undefined);
  const [selectedTemperature, updateTemperature] = useState(0.8);
  const [selectedTop_p, updateTop_p] = useState(0.8);
  const [selectedTokens, updateTokens] = useState(2000);
  const [showSpinner, setSpinner] = useState("hidden");

  const fetchAssistantRes = async (message) => {
    var postData = {
      prompt: message,
      useMT: useMT,
      temperature: selectedTemperature,
      max_new_tokens: selectedTokens,
      top_p: selectedTop_p,
      deployment: selectedModel,
    };

    console.log("postdata...", postData);

    setSpinner("visible");

    try {
      const response = await fetch("/assistant/generateResponse", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      updateMessages(data.messages);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setSpinner("hidden");
  };

  const clearChat = async () => {

    setSpinner("visible");

    try {
      const response = await fetch("/clearChat", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: "",
      });

      const data = await response.json();
      updateMessages(data.messages);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setSpinner("hidden");
  };

  const toggleMT = () => {
    toggleUseMT(!useMT);
    localStorage.setItem("useMT", useMT);
    console.log(localStorage.getItem("useMT"));
  };

  const handleChange = (value) => {
    if (value !== currentMessage) updateCurrentChat(value);
  };

  const setModel = (value) => {
    if (value !== selectedModel) updateModelSelection(value);
    console.log(value);
  };

  const setTemperature = (value) => {
    if (value !== selectedTemperature) updateTemperature(value);
  };

  const setTop_p = (value) => {
    if (value !== selectedTop_p) updateTop_p(value);
  };

  const setTokens = (value) => {
    if (value !== selectedTokens) updateTokens(value);
    console.log(value);
  };

  const handleSend = () => {
    const query = new ChatMessage({
      id: "", // Id will be generated by storage generator, so here you can pass an empty string
      content: currentMessage,
      contentType: MessageContentType.TextHtml,
      senderId: "user-123",
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent,
    });

    console.log(currentMessage);

    fetchAssistantRes(query);
    updateCurrentChat("");

    // send the req
  };
  useEffect(() => {
    //    fetchData();
  }, []);

  return (
    <div>
      <table>
        <tr >
          <td style={{paddingLeft: "30px"}}>
            <div
              dir="ltr"
              style={{
                position: "relative",
                height: "840px",
                width: "1300px",
                top: "0px",
                left: "0px",
                textAlign: "left",
                fontFamily: "Segoe UI",
                lineHeight: "1.5",
              }}
            >
              <MainContainer>
                <ChatContainer>
                  <MessageList>
                    {messages ? (
                      messages.map((message) => (
                        <div>
                          <Message
                            key={message.id}
                            model={{
                              message: message.content,
                              id: message.id,
                              direction: message.direction,
                              sentTime: "just now",
                              position: "normal",
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div style={{ visibility: "hidden" }}></div>
                    )}
                    <div
                      class="circle"
                      id="spinnerID"
                      style={{ visibility: showSpinner }}
                    ></div>
                    <div
                      style={{
                        fontSize: 12,
                        textAlign: "center",
                        visibility: showSpinner,
                      }}
                    >
                      Generating response
                    </div>
                  </MessageList>
                </ChatContainer>
              </MainContainer>
              <MessageInput
                style={{
                  height: "60px",
                  width: "100%",
                  marginLeft: "0",
                  marginTop: "5px",
                }}
                value={currentMessage}
                onChange={handleChange}
                onSend={() => handleSend()}
                attachButton={false}
                placeholder="Ask anything (Shift + Enter for new line)"
              />
              <Button theme="blue" onClick={clearChat}>Clear chat</Button>
            </div>
          </td>
          <td>
            <div>
              <div class="deployment">
                <h6>Deployment</h6>
                <Select
                  onChange={(e) => setModel(e.value)}
                  isSearchable
                  options={[
                    {
                      label: "phi-3-mini-4k-instruct",
                      value: "phi-3-mini-4k-instruct-5",
                    },
                    { label: "GPT-4", value: "gpt-4-melghaz" },
                  ]}
                ></Select>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div class="textbox">
                <h6>Parameters</h6>
                <TextField
                  required
                  label="temperature"
                  defaultValue="0.8"
                  size="small"
                  onChange={(e) => setTemperature(e.target.value)}
                />
                <br />
                <br />
                <TextField
                  required
                  label="top_p"
                  defaultValue="0.8"
                  size="small"
                  onChange={(e) => setTop_p(e.target.value)}
                />
                <br />
                <br />
                <TextField
                  required
                  label="max_new_tokens"
                  defaultValue="2000"
                  size="small"
                  onChange={(e) => setTokens(e.target.value)}
                />
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <table >
              <tr>
                <td style={{textAlign: "right",  paddingLeft: "35px"}}>
                  <h6>Azure AI Translator</h6>
                </td>
                <td>
                  <label class="switch1">
                    <input
                      type="checkbox"
                      onChange={toggleMT}
                      checked={useMT}
                    />
                    <div class="slider round"></div>
                  </label>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
};
