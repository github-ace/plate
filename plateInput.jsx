/* eslint-disable react/no-multi-comp */
import Taro, { Component } from "@tarojs/taro";
import PropTypes from "prop-types";
import { View, Text, Image } from "@tarojs/components";
import styles from "./plateInput.module.less";

export default class Index extends Component {
  static defaultProps = {
    onCurrentCode: PropTypes.func
  };
  state = {
    current: 0,
    code: ["浙", "", "", "", "", "", "", ""],
    keyBoardList: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X"],
      ["确定", "C", "V", "B", "N", "M", "港", "澳", "学", "领", "删除"]
    ],
    keyBoardListArea: [
      ["京", "津", "沪", "冀", "豫", "云", "辽", "黑", "湘"],
      ["皖", "鲁", "新", "苏", "浙", "赣", "鄂", "桂", "甘"],
      ["晋", "蒙", "陕", "吉", "闽", "贵", "粤", "川"],
      ["青", "藏", "琼", "宁", "渝", "使"]
    ],
    keyBoardShow: false,
    needAdapter: false
  };
  keyBoardShow() {
    this.setState({ keyBoardShow: true });
    if(Taro.getEnv() == 'WEB'){document.querySelector('.taro-tabbar__panel').scrollTop="1800"}else{Taro.pageScrollTo({ scrollTop: 1800 })};
  }
  changeCurrent(e) {
    this.setState({ current: e });
  }
  editCurrentInput(e) {
    var code = this.state.code;
    var val = e.currentTarget.dataset.val;
    if (
      (this.state.current == 1 && /^\d$/.test(val)) ||
      (this.state.current != 0 && "港澳学领IO".indexOf(val) > -1)
    ) {
      return;
    }
    if (val == "删除") {
      code[this.state.current] = "";
      var current =
        this.state.current == 7
          ? 7
          : this.state.current - 1 < 0
          ? 0
          : this.state.current - 1;
      this.setState({
        code: code,
        current: current
      });
      this.props.onCurrentCode(this.state.code);
      return;
    }
    if (val == "确定") {
      this.setState({ keyBoardShow: false });
      return;
    }
    code[this.state.current] = val;
    // console.log(code)
    var current =
      this.state.current == 7
        ? 7
        : this.state.current + 1 > 6
        ? 6
        : this.state.current + 1;
    this.setState({
      code: code,
      current: current
    });
    this.props.onCurrentCode(this.state.code);
  }
  componentDidMount() {
    Taro.getSystemInfo({
      success: res =>
        this.setState({ needAdapter: res.model.indexOf("iPhone X") > -1 })
    });
  }
  render() {
    console.log(this.state.current);
    return (
      <View>
        <View className={styles.inputG} onClick={() => this.keyBoardShow()}>
          {this.state.code.slice(0, 2).map((item, index) => (
            <Text
              onClick={() => this.changeCurrent(index)}
              className={
                styles.item +
                " " +
                (this.state.current == index ? styles.active : "")
              }
              key={index}
            >
              {item}
            </Text>
          ))}
          <Text
            style={{
              color: "#6f6f6f",
              fontSize: Taro.pxTransform(80),
              lineHeight: Taro.pxTransform(75)
            }}
          >
            ·
          </Text>
          {this.state.code.slice(2, 7).map((item, index) => (
            <Text
              onClick={() => this.changeCurrent(index + 2)}
              className={
                styles.item +
                " " +
                (this.state.current == index + 2 ? styles.active : "")
              }
              key={index}
            >
              {item}
            </Text>
          ))}
          <View
            onClick={() => this.changeCurrent(7)}
            className={
              styles.item + " " + (this.state.current == 7 ? styles.active : "")
            }
          >
            {this.state.code[7] == "" ? (
              <Image
                className={styles.new_power}
                src={
                  Taro.getApp().getGlobalData.imgUrlBase +
                  "/tingche/pay/new_power.png"
                }
              />
            ) : (
              this.state.code[7]
            )}
          </View>
        </View>
        <View
          className={styles.keyboard}
          style={{
            display: this.state.keyBoardShow ? "" : "none",
            paddingBottom: this.state.needAdapter ? Taro.pxTransform(88) : ""
          }}
        >
          {this.state.current == 0
            ? this.state.keyBoardListArea.map((item, index) => (
                <View
                  className={styles.line}
                  style={{
                    width:
                      index == 2
                        ? Taro.pxTransform(628)
                        : index == 3
                        ? Taro.pxTransform(464)
                        : ""
                  }}
                  key={index}
                >
                  {item.map((e, indexs) => (
                    <Text
                      data-val={e}
                      onClick={i => this.editCurrentInput(i)}
                      className={styles.item}
                      key={indexs}
                    >
                      {e}
                    </Text>
                  ))}
                </View>
              ))
            : this.state.keyBoardList.map((item, index) => (
                <View className={styles.line} key={index}>
                  {item.map((e, indexs) => (
                    <Text
                      data-val={e}
                      onClick={i => this.editCurrentInput(i)}
                      className={
                        styles.item +
                        " " +
                        (e == "确定" || e == "删除" ? styles.btn : "") +
                        " " +
                        ((this.state.current == 1 && index == 0) ||
                        (this.state.current != 0 &&
                          "港澳学领IO".indexOf(e) > -1)
                          ? styles.active
                          : "")
                      }
                      key={indexs}
                    >
                      {e}
                    </Text>
                  ))}
                </View>
              ))}
        </View>
      </View>
    );
  }
}
