<?php

    require 'util.php';

    class Subject {

        private $isRejected = false;
        private $subNo;
        private $osuID;
        private $age;
        private $gender;
        private $time;
        private $data;
        private $allTrials = [];
        private $correctTrials = [];
        private $trimmedTrials = [];
        public $acc;
        public $rt;
        public $opt;

        public function __construct($subNo, $data, $time) {
            $this->subNo = $subNo;
            $this->data = $data;
            $this->time = $time;
            $this->yieldUserInfoData();
            $this->yieldAllTrialsData();
            $this->yieldCorrectTrialsData();
            $this->yieldTrimmedTrialsData();
            $this->yieldSubjectSummaryData();
        }

        public function getSubNo() {
            return $this->subNo;
        }

        public function getOsuID() {
            return $this->osuID;
        }

        public function getAge() {
            return $this->age;
        }

        function getGender() {
            return $this->gender;
        }

        function getTime() {
            return $this->time;
        }

        function getData() {
            return $this->data;
        }

        function reject() {
            $this->isRejected = true;
        }

        function isRejected() {
            return $this->isRejected;
        }

        // Wrap the subject data into a PHP Array
        public function toArray() {
            $result = [];
            array_push($result, $this->subNo);
            array_push($result, $this->osuID);
            array_push($result, $this->age);
            array_push($result, $this->gender);
            array_push($result, $this->time);
            array_push($result, $this->acc);
            array_push($result, $this->rt);
            array_push($result, $this->opt);
            return $result;
        }

        public static function getCsvHeaderArray() {
            return ["sub_no", "osu_id", "age", "gender", "time", "acc", "rt",
                        "opt"];
        }

        private function yieldUserInfoData() {
            $temp_pos1 = strrpos($this->data, "_user_data")+12;
            $temp_pos2 = strlen($this->data)-4;
            $subInfoJSON = substr($this->data, $temp_pos1, $temp_pos2-$temp_pos1);
            $subInfoArray = json_decode($subInfoJSON,true);
            $this->osuID = $subInfoArray['osu_id'];
            $this->age = $subInfoArray['self_reported_age'];
            $this->gender = $subInfoArray['self_reported_gender'];
        }

        function yieldAllTrialsData() {
            $temp_pos1 = strrpos($this->data, "AllTrialsData")+15;
            $temp_pos2 = strrpos($this->data, "BrowserInfo")-3;

            $dataJSON = substr($this->data, $temp_pos1, $temp_pos2-$temp_pos1);

            $dataArray = json_decode($dataJSON,true);

            foreach ($dataArray as $blocks => $trials) {
                foreach ($trials as $trial => $trialData) {
                    $t = new Trial();
                    $t->blockNo = intval($trialData["blockNumber"]);
                    $t->blockTrialNo = intval($trialData["blockTrial"]);
                    $t->trialNo = ($t->blockNo-1)*108+$t->blockTrialNo; //TODO: address this 108 issue
                    $t->acc = intval($trialData["acc"]);
                    $t->rt = intval($trialData["rt"]);
                    $t->targChoice = intval($trialData["targChoice"]);
                    $t->isOpt = ($t->targChoice===1) ? 1 : (($t->targChoice===2) ? 0 : "N/A");
                    array_push($this->allTrials, $t);
                }
            }

        }


        function yieldCorrectTrialsData() {
            foreach ($this->allTrials as $t) {
                if($t->acc===1) {
                    array_push($this->correctTrials, $t);
                }
            }
        }


        // Remove trials in which subject responded less than 300 ms, less than
        // 3 std below the mean RT, or more than 3 std above the mean RT.
        //
        function yieldTrimmedTrialsData() {
            $mean = $this->getMeanRT($this->correctTrials);
            $std = $this->getStdRT($this->correctTrials);
            foreach ($this->correctTrials as $t) {
                if(($t->rt>300)&&($t->rt>$mean-3*$std)&&($t->rt<$mean+3*$std)) {
                    array_push($this->trimmedTrials, $t);
                }
            }
        }



        function yieldSubjectSummaryData() {
            $numAllTrials = count($this->allTrials);
            $numCorrectTrials =count($this->correctTrials);
            $totalRT = 0;
            $numOpt = 0;
            foreach ($this->trimmedTrials as $trial) {
                $totalRT += $trial->rt;
                $numOpt += $trial->isOpt;
            }
            $this->acc = $numCorrectTrials/$numAllTrials*100;
            $this->rt = $totalRT/$numCorrectTrials;
            $this->opt = $numOpt/$numCorrectTrials*100;
        }


        // Given an array of <Trial>, return mean RT.
        function getMeanRT($trials) {
            $result=0;
            $n = 0;
            foreach ($trials as $t) {
                $n++;
                $result+=$t->rt;
            }
            $result = $result/$n;
            return $result;
        }


        // Given an array of <Trial>, return RT standard deviation.
        function getStdRT($trials) {
            $rts = [];
            foreach ($trials as $t) {
                array_push($rts, $t->rt);
            }
            return getStdDev($rts);
        }

    }


    class Trial {

        public $trialNo;
        public $blockTrialNo;
        public $blockNo;
        public $optTargColor;
        public $optTargDigit;
        public $optTargPos;
        public $nonOptTargColor;
        public $nonOptTargDigit;
        public $nonOptTargPos;
        public $response;
        public $targChoice;
        public $acc;
        public $rt;
        public $isOpt;
        public $isSwitch;

    }


 ?>
