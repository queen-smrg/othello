'use strict';

//othelloのフィールドを作成
let othello_feld = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, -1, 1, 0, 0, 0],
  [0, 0, 0, 1, -1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

let othello_feld_id = [
  ["a1_00", "b1_01", "c1_02", "d1_03", "e1_04", "f1_05", "g1_06", "h1_07"],
  ["a2_10", "b2_11", "c2_12", "d2_13", "e2_14", "f2_15", "g2_16", "h2_17"],
  ["a3_20", "b3_21", "c3_22", "d3_23", "e3_24", "f3_25", "g3_26", "h3_27"],
  ["a4_30", "b4_31", "c4_32", "d4_33", "e4_34", "f4_35", "g4_36", "h4_37"],
  ["a5_40", "b5_41", "c5_42", "d5_43", "e5_44", "f5_45", "g5_46", "h5_47"],
  ["a6_50", "b6_51", "c6_52", "d6_53", "e6_54", "f6_55", "g6_56", "h6_57"],
  ["a7_60", "b7_61", "c7_62", "d7_63", "e7_64", "f7_65", "g7_66", "h7_67"],
  ["a8_70", "b8_71", "c8_72", "d8_73", "e8_74", "f8_75", "g8_76", "h8_77"]
];

//最初の手番
let user = 1; //userが黒スタート

//棋譜のリスト　要素数68で終了させる
let game_record = ["d4", "d5", "e4", "e5"];

let message_p = document.getElementById("message_box");
message_p.innerText = "ゲームが開始されました。";

const col_names = ["a", "b", "c", "d", "e", "f", "g", "h"];


const calc_array = [
  -11, -10, -9, //左上, 真上, 右上,
  -1, 0, 1,     //真左, なし, 真右,
  9, 10, 11     //左下, 真下, 右下
];

//othello_fieldを表示
function display_othello() {
  for (let r = 0; r < 8; r++) {
    let feld_line = othello_feld[r];
    for (let c = 0; c < 8; c++) {
      let span_tag = document.createElement('span');
      if (feld_line[c] == 1) {
        span_tag.classList.add("dice_b")
        document.getElementById(othello_feld_id[r][c]).appendChild(span_tag);
      } else if (feld_line[c] == -1) {
        //feld_line[c] = '○';
        span_tag.classList.add("dice_w")
        document.getElementById(othello_feld_id[r][c]).appendChild(span_tag);
      } else {
        ;
      }
    }
    //console.log(feld_line)
  }
  console.log("盤面を表示しました")
  return;
}

display_othello()

/** othello_self **************************************************************/
function set_onclick_self() {
  //onclick属性を設定
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (othello_feld[r][c] == 0) {
        document.getElementById(othello_feld_id[r][c]).setAttribute("onclick", "place_stone_self(this.id)")
      }
    }
  }
}


set_onclick_self()



//onclik関数
function place_stone_self(cell_id) {
  //クリックしたセルのidを取得
  let cell_div = document.getElementById(cell_id);
  let cell_row_num = Number(cell_id[3]); //列番号
  let cell_col_num = Number(cell_id[4]); //行番号

  let around_array = [
    0, 0, 0, //左上, 真上, 右上,
    0, 0, 0, //真左, なし, 真右,
    0, 0, 0  //左下, 真下, 右下
  ];

  //石を置く
  if (game_record.length % 2 == 0) {
    //黒石を置けるかのチェック
    if (check_place_self(1, cell_row_num, cell_col_num, around_array) == false) {
      console.log("黒はおけません");
      return;
    } else {
      othello_feld[cell_row_num][cell_col_num] = 1; //黒石を置く
      change_stone_self(1, around_array)            //石の色を変える
      message_p.innerText = "白の番です";
    }
  } else {
    //白石を置けるかのチェック
    if (check_place_self(-1, cell_row_num, cell_col_num, around_array) == false) {
      console.log("白はおけません");
      return;
    } else {
      othello_feld[cell_row_num][cell_col_num] = -1; //白石を置く
      change_stone_self(-1, around_array)            //石の色を変える
      message_p.innerText = "黒の番です";
    }
  }

  //棋譜に追加
  game_record.push(cell_id)
  //console.log("game_record", game_record.length)

  display_othello()

  //結果の判定
  judgement_self()

  //onclik削除
  cell_div.removeAttribute("onclick");
  return;
}


//置ける場所を探す関数
function check_place_self(turn_num, row_num, col_num, array) {

  //周囲すべて0なら飛ばす。
  for (let i = 0; i < array.length; i++) {
    let cell_indx = String((row_num * 10 + col_num) + calc_array[i]);
    if (0 <= Number(cell_indx) && Number(cell_indx) < 78) {
      if (Number(cell_indx) < 10) {
        //一桁のときは先頭に0追加
        cell_indx = "0" + cell_indx;
      }
      //console.log(cell_indx)
      if (othello_feld[cell_indx[0]][cell_indx[1]] == turn_num * -1) {
        array[i] = cell_indx;
      } else {
        continue;
      }
    }
  }
  console.log(array)

  let around_array_sum = array.reduce(function (sum, num) {
    return sum + num;
  }, 0);

  if (around_array_sum == 0) {
    console.log("周りに石がありません。")
    return false;

  } else {
    for (let i = 0; i < array.length; i++) {
      //console.log(i, "回目", array[i])
      if (array[i] == 0) {
        continue;
      } else {
        for (let j = 1; j < 8; j++) {
          let indx = String(Number(array[i]) + calc_array[i] * j);
          if (0 <= Number(indx) && Number(indx) < 78) {
            if (Number(indx) < 10) {
              //一桁のときは先頭に0追加
              indx = "0" + indx;
            }
            //console.log(indx)
            let othello_feld_cell = othello_feld[indx[0]][indx[1]];
            //console.log("othello_feld_cell", othello_feld_cell)
            if (othello_feld_cell == 0) {
              break;
            } else if (othello_feld_cell == turn_num * -1) {
              ;
            } else if (othello_feld_cell == turn_num) {
              return true;
            } else {
              break;
            }
          }
        }
      }
    }
    return false;
  }

}

//石の色を変える関数
function change_stone_self(turn_num1, array) {
  let change_place_array = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] == 0) {
      continue;
    } else {
      let change_place_array_child = [];
      for (let j = 0; j < 8; j++) {
        let indx = String(Number(array[i]) + calc_array[i] * j);
        if (0 <= Number(indx) && Number(indx) < 78) {
          if (Number(indx) < 10) {
            //一桁のときは先頭に0追加
            indx = "0" + indx;
          }

          let othello_feld_cell = othello_feld[indx[0]][indx[1]];
          //console.log("othello_feld_cell", othello_feld_cell)
          if (othello_feld_cell == turn_num1 * -1) {
            change_place_array_child.push(indx);
          } else if (othello_feld_cell == turn_num1) {
            //console.log("change_place_array_child", change_place_array_child)
            change_place_array = change_place_array.concat(change_place_array_child);
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  //console.log(change_place_array)

  for (let i = 0; i < change_place_array.length; i++) {
    let change_indx = change_place_array[i];
    if (turn_num1 == 1) {
      othello_feld[change_indx[0]][change_indx[1]] = 1;
    } else {
      othello_feld[change_indx[0]][change_indx[1]] = -1;
    }
  }
  return;
}

//パスボタンの関数
function pass_self() {
  if (game_record.length % 2 == 0) {
    message_p.innerText = "黒がパスしたので白の番です。";
  } else {
    message_p.innerText = "白がパスしたので黒の番です。";
  }
  game_record.push("pass");
  judgement_self()
}

//フィールドに0があるかのチェック
function is_0_inFelid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (othello_feld[i][j] == 0) {
        return false;
      } else {
        continue;
      }
    }
  }
  return true;
}

//最終の結果判定チェック
function judgement_self() {
  let game_record_slice = game_record.slice(-2);
  //console.log(game_record_slice)
  if (is_0_inFelid() || (game_record_slice[0] == "pass" && game_record_slice[1] == "pass")) {
    let count = [0, 0]; //[黒の個数、白の個数]

    for (let r = 0; r < 8; r++) {
      //console.log(othello_feld[r]);
      let sum_b = othello_feld[r].filter(function (value) {
        return value == 1;
      })
      count[0] = count[0] + sum_b.length;

      let sum_w = othello_feld[r].filter(function (value) {
        return value == -1;
      })
      count[1] = count[1] + sum_w.length;
    }

    let message_text = count[0] + "対" + count[1];

    //結果アラートの表示
    if (count[0] > count[1]) {
      message_p.innerHTML = message_text + "で黒の勝ちです。";
    } else if (count[0] < count[1]) {
      message_p.innerHTML = message_text + "で白の勝ちです。";
    } else if (count[0] == count[1]) {
      message_p.innerHTML = message_text + "で引き分けです。";
    }
    console.log("結果が表示されました")
  }
  return;
}

/************************************************************************************* */



