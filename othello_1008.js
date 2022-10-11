'use strict';

//othelloのフィールドを作成
let othello_field = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, -1, 1, 0, 0, 0],
  [0, 0, 0, 1, -1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];


//セルのスコア
const othello_field_score = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120]
];

const othello_field_id = [
  ["a1_00", "b1_01", "c1_02", "d1_03", "e1_04", "f1_05", "g1_06", "h1_07"],
  ["a2_10", "b2_11", "c2_12", "d2_13", "e2_14", "f2_15", "g2_16", "h2_17"],
  ["a3_20", "b3_21", "c3_22", "d3_23", "e3_24", "f3_25", "g3_26", "h3_27"],
  ["a4_30", "b4_31", "c4_32", "d4_33", "e4_34", "f4_35", "g4_36", "h4_37"],
  ["a5_40", "b5_41", "c5_42", "d5_43", "e5_44", "f5_45", "g5_46", "h5_47"],
  ["a6_50", "b6_51", "c6_52", "d6_53", "e6_54", "f6_55", "g6_56", "h6_57"],
  ["a7_60", "b7_61", "c7_62", "d7_63", "e7_64", "f7_65", "g7_66", "h7_67"],
  ["a8_70", "b8_71", "c8_72", "d8_73", "e8_74", "f8_75", "g8_76", "h8_77"]
];



//棋譜のリスト　要素数68で終了させる
let game_record = ["d4_33", "d5_43", "e4_34", "e5_44"];
const row_col_nums = [0, 1, 2, 3, 4, 5, 6, 7];

const corners = ["00", "70", "07", "77"];

let message_p = document.getElementById("message_box");
message_p.innerText = "ゲームを始めましょう！";

const calc_array = [
  -11, -10, -9, //左上, 真上, 右上,
  -1, 0, 1,     //真左, なし, 真右,
  9, 10, 11     //左下, 真下, 右下
];



//othello_fieldを表示
function display_othello() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let cell_value = othello_field[r][c]; //0,1,-1
      let span_tag = document.createElement('span');
      let cell_tag = document.getElementById(othello_field_id[r][c]);
      cell_tag.innerHTML = "";
      if (cell_value == 1) {
        span_tag.classList.add("dice_b")
        cell_tag.removeAttribute("onclick");
      } else if (cell_value == -1) {
        span_tag.classList.add("dice_w")
        cell_tag.removeAttribute("onclick");
      } else {
        ;
      }
      cell_tag.appendChild(span_tag);
    }
    //console.log(othello_field[r])
  }
  //console.log("盤面を表示しました")
  //console.log(game_record);
  return;
}


//onclick属性を設定
function set_onclick(func_name) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (othello_field[r][c] == 0) {
        document.getElementById(othello_field_id[r][c]).setAttribute("onclick", func_name)
      }
    }
  }
}

set_onclick("place_stone_self(this.id)")

/************************* othello_self *****************************/

let turn = 1;
let turn_text = "";


//onclik関数
function place_stone_self(cell_id) {
  //クリックしたセルのidを取得
  let cell_div = document.getElementById(cell_id);
  let cell_row_num = Number(cell_id[3]); //列番号
  let cell_col_num = Number(cell_id[4]); //行番号

  //黒か白を決定
  if (game_record.length % 2 == 0) {
    turn = 1;
    turn_text = "白";
  } else {
    turn = -1;
    turn_text = "黒";
  }

  let check_func = check_place_self(turn, cell_row_num, cell_col_num, othello_field);
  if (check_func[0] == false) {
    console.log("おけません");
    return;
  } else {
    othello_field[cell_row_num][cell_col_num] = turn; //黒石を置く
    change_stone_self(turn, check_func[1], othello_field);            //石の色を変える
    message_p.innerText = turn_text + "の番です";
  }

  //棋譜に追加
  game_record.push(cell_id)
  display_othello()

  //結果の判定
  judgement()

  //onclik削除
  cell_div.removeAttribute("onclick");
  return;

}



function check_place_self(turn_num, row_num, col_num, field_array2d) {
  //周囲すべて0なら飛ばす。
  let around_places = [
    0, 0, 0, //左上, 真上, 右上,
    0, 0, 0, //真左, なし, 真右,
    0, 0, 0  //左下, 真下, 右下
  ];

  let around_places_sum = 0;
  let k = -1;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      k++;
      if (row_col_nums.includes(row_num + i) && row_col_nums.includes(col_num + j)) {
        if (field_array2d[row_num + i][col_num + j] == turn_num * -1) {
          around_places[k] = String(row_num + i) + String(col_num + j);
          around_places_sum = around_places_sum + (row_num + i) * 10 + (col_num + j);
        } else {
          continue; //undefindのときは次のループ
        }
      }
    }
  }

  if (around_places_sum == 0) {
    return [false, around_places];
  } else {
    for (let i = 0; i < around_places.length; i++) {
      if (around_places[i] == 0) {
        continue;
      } else {
        for (let j = 1; j < 8; j++) {
          let cell_index_int = Number(around_places[i]) + calc_array[i] * j;
          if (0 <= cell_index_int && cell_index_int < 78) {
            let cell_index_str = ('00' + cell_index_int).slice(-2);
            let othello_field_cell = field_array2d[cell_index_str[0]][cell_index_str[1]];
            if (othello_field_cell == 0) {
              break;
            } else if (othello_field_cell == turn_num * -1) {
              ;
            } else if (othello_field_cell == turn_num) {
              return [true, around_places];
            } else {
              break;
            }
          }
        }
      }
    }
    return [false, around_places];
  }
}


//石の色を変える関数
function change_stone_self(turn_num, array, field_array2d) {
  let change_places = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] == 0) {
      continue;
    } else {
      let change_places_child = [];
      for (let j = 0; j < 8; j++) {
        let cell_indx_int = Number(array[i]) + calc_array[i] * j;
        if (0 <= cell_indx_int && cell_indx_int < 78) {
          let cell_index_str = ('00' + cell_indx_int).slice(-2);
          let othello_field_cell = field_array2d[cell_index_str[0]][cell_index_str[1]];
          if (othello_field_cell == turn_num * -1) {
            change_places_child.push(cell_index_str);
          } else if (othello_field_cell == turn_num) {
            change_places = change_places.concat(change_places_child);
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  for (let i = 0; i < change_places.length; i++) {
    let change_indx = change_places[i];
    if (turn_num == 1) {
      field_array2d[change_indx[0]][change_indx[1]] = 1;
    } else {
      field_array2d[change_indx[0]][change_indx[1]] = -1;
    }
  }
  return;

}


//パスボタンの関数
function pass_self() {
  let message_p_text = "";
  if (turn == 1) {
    message_p_text = "黒がパスしたので白の番です。";
  } else if (turn == -1) {
    message_p_text = "白がパスしたので黒の番です。";
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (othello_field[r][c] == 0) {
        let st = check_place_self(turn, r, c, othello_field);
        if (st[0] == true) {
          message_p.innerText = "置けるところがあります。";
          return;
        } else {
          ;
        }
      }
    }
  }

  message_p.innerText = message_p_text;
  game_record.push("pass");
  judgement()
}


//フィールドに0があるかのチェック
function is_0_inFelid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (othello_field[i][j] == 0) {
        return false;
      } else {
        continue;
      }
    }
  }
  return true;
}

function can_not_place_all() {
  //白も黒も置けなければtrue
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let st_b = check_place_self(1, r, c, othello_field);
      let st_w = check_place_self(-1, r, c, othello_field);
      if (st_b[0] || st_w[0]) {
        return false;
      }
    }
  }
  return true;
}

//最終の結果判定チェック
function judgement() {
  let game_record_slice = game_record.slice(-2);
  if (can_not_place_all() || is_0_inFelid() || (game_record_slice[0] == "pass" && game_record_slice[1] == "pass")) {
    let count = [0, 0]; //[黒の個数、白の個数]

    for (let r = 0; r < 8; r++) {
      let sum_b = othello_field[r].filter(function (value) {
        return value == 1;
      })
      count[0] = count[0] + sum_b.length;

      let sum_w = othello_field[r].filter(function (value) {
        return value == -1;
      })
      count[1] = count[1] + sum_w.length;
    }

    let message_text = count[0] + "対" + count[1];

    //結果アラートの表示
    if (count[0] > count[1]) {
      message_text = message_text + "で黒の勝ちです。";
    } else if (count[0] < count[1]) {
      message_text = message_text + "で白の勝ちです。";
    } else if (count[0] == count[1]) {
      message_text = message_text + "で引き分けです。";
    }

    setTimeout(function () {
      message_p.innerText = message_text;
    }, 1000);
    console.log("結果が表示されました");
    console.log(game_record);
  }
  return;
}


/***************************** othello_vs_cpu ********************************************** */

//ラジオボタンの値を取得
let teban = 0;
let level = 0;
let support = 0;

const turn_texts = ["白", "黒"];


function audio() {
  document.getElementById('btn_audio').currentTime = 0; //連続クリックに対応
  document.getElementById('btn_audio').play(); //クリックしたら音を再生
}



//TO DO 開始ボタンの処理
function othello_start() {
  //othello版を表示
  display_othello();

  teban = Number(document.getElementById('teban_rad').elements["teban"].value);
  level = document.getElementById('level_rad').elements["level"].value;
  support = document.getElementById('support_rad').elements["support"].value;

  //石を置く関数を配置
  set_onclick("place_stone_vs(this.id)");

  if (teban == -1) {
    //CPUが黒を置く
    place_cpu(teban * -1, level);
  } else if (teban == 1) {
    message_p.innerText = "黒の番です";
    show_support(teban, support);
  }

  let start_btn = document.getElementById("start_btn");
  start_btn.removeAttribute("onclick");

}




function place_stone_vs(cell_id) {
  //クリックしたセルのidを取得
  let cell_div = document.getElementById(cell_id);
  let cell_row_num = Number(cell_id[3]); //列番号
  let cell_col_num = Number(cell_id[4]); //行番号


  let check_func = check_place_self(teban, cell_row_num, cell_col_num, othello_field);
  if (check_func[0] == false) {
    console.log("おけません");
    return;
  } else {
    othello_field[cell_row_num][cell_col_num] = teban; //石を置く
    change_stone_self(teban, check_func[1], othello_field);            //石の色を変える
    message_p.innerText = turn_texts[game_record.length % 2] + "の番です";
  }

  //userの置いた石を表示
  display_othello();
  show_support(teban * -1, support);

  //CPUが石を置く
  place_cpu(teban * -1, level);

  //棋譜に追加
  game_record.push(cell_id);

  //結果の判定
  judgement();

  //onclik削除
  cell_div.removeAttribute("onclick");
  return;
}




//cpuがうつ
function place_cpu(turn_num, level_num) {
  if (is_0_inFelid() || can_not_place_all()) {
    judgement();
    return;
  }

  //置ける場所をリストアップ
  console.log("CPUが考え中・・・");
  let can_place_id = [];
  let can_place = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (othello_field[r][c] == 0) {
        let check_func = check_place_self(turn_num, r, c, othello_field);
        if (check_func[0] == true) {
          can_place_id.push(String(r) + String(c));
          can_place.push(check_func[1]);
        } else {
          ;
        }
      } else {
        ;
      }
    }
  }

  let get_index = "";
  let get = "";
  let get_cell = "";
  if (can_place.length == 0) {
    //置けるところが無ければpassして終了
    game_record.push("pass");
    show_support(teban, support);
    judgement();
    console.log("CPUがパスしました。");
    message_p.innerText = "CPUがパスしました。";
    return;
  } else if (can_place.length == 1) {
    //置けるところが1個しかないならおいて終了
    console.log("置けるところがひとつだけです。");
    get = can_place[0];
    get_cell = can_place_id[0];
    change_stone_self(turn_num, get, othello_field);
    othello_field[get_cell[0]][get_cell[1]] = turn_num;
  } else {
    //置けるところが2つ以上あるとき
    if (level_num == 0) {
      //levelが0ならランダムに場所を選ぶ
      get_index = Math.floor(Math.random() * can_place.length)
      get = can_place[get_index];
      get_cell = can_place_id[get_index];
      change_stone_self(turn_num, get, othello_field);
      othello_field[get_cell[0]][get_cell[1]] = turn_num;

    } else if (level_num == 1) {
      //スコアに応じて置く場所を決める
      get_index = best_place_level1(turn_num, can_place_id, can_place, othello_field);
      get = can_place[get_index];
      get_cell = can_place_id[get_index];
      change_stone_self(turn_num, get, othello_field);
      othello_field[get_cell[0]][get_cell[1]] = turn_num;
    }
    }
    setTimeout(function () {
      //1秒後に色を変える
      display_othello();
      console.log("CPUが置きました", get_cell);
      message_p.innerText = turn_texts[game_record.length % 2] + "の番です";
      game_record.push(othello_field_id[get_cell[0]][get_cell[1]]);
      show_support(turn_num * -1, support);
      judgement();
    }, 1000);
    return;
  }


  //パスボタンの関数
  function pass_vs() {
    if (teban == 0) {
      return;
    }
    let message_p_text = "";
    console.log("pass", teban)
    if (teban == 1) {
      message_p_text = "黒がパスしたので白の番です。";
    } else if (teban == -1) {
      message_p_text = "白がパスしたので黒の番です。";
    }

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (othello_field[r][c] == 0) {
          let st = check_place_self(teban, r, c, othello_field);
          if (st[0] == true) {
            message_p.innerText = "置けるところがあります。";
            return;
          } else {
            ;
          }
        }
      }
    }

    audio();
    message_p.innerText = message_p_text;
    game_record.push("pass");
    setTimeout(() => {
      place_cpu(teban * -1, level);
      judgement();
    }, 1000);
    judgement();
  }




  function show_support(turn_num, support_num) {
    if (support_num == 0) {
      return;
    }
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (othello_field[r][c] == 0) {
          let cell_supprot = check_place_self(turn_num, r, c, othello_field);
          if (cell_supprot[0]) {
            let support_span = document.createElement('span');
            let support_div = document.getElementById(othello_field_id[r][c]);
            support_span.classList.add("support_mark");
            support_div.appendChild(support_span);
          }
        }
      }
    }
  }



  function arrayShuffle(array) {
    for (let i = (array.length - 1); 0 < i; i--) {

      // 0〜(i+1)の範囲で値を取得
      let r = Math.floor(Math.random() * (i + 1));

      // 要素の並び替えを実行
      let tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  }



  function best_place_level1(turn_num, can_place_id_array, can_place_array, field_array2d) {
    let decided_place_index = ""
    if (can_place_id_array.length == 0) {
      decided_place_index = "pass"
    } else {
      //セルのスコアを取得
      let can_place_score = [];
      for (let i = 0; i < can_place_id_array.length; i++) {
        let cell_id = can_place_id_array[i]
        let cell_score = othello_field_score[cell_id[0]][cell_id[1]];
        can_place_score.push(cell_score);
      }
      //scoreの高いところに積極的に置く
      let max_score = Math.max(...can_place_score);
      let max_score_index = [];
      let hoge = -1;
      while (true) {
        hoge = can_place_score.indexOf(max_score, hoge + 1);
        if (hoge == -1) {
          break;
        } else {
          max_score_index.push(hoge);
        }
      }

      if (max_score_index.length == 1) {
        decided_place_index = max_score_index[0];
      } else {
        let max_score_index_shuffled = arrayShuffle(max_score_index);
        decided_place_index = max_score_index_shuffled[0];
      }
    }

    return decided_place_index;
  }
