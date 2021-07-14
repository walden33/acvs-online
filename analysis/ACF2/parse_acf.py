import os
import json
import csv


def main():
    trials_per_block = 21
    data_dir = 'Data/Raw/'
    out_dir = 'Data/Parsed/'
    for sub in os.listdir(data_dir):
        if os.path.isdir(data_dir + sub):
            for fname in os.listdir(data_dir + sub):
                if (fname.startswith('data')):
                    with open(data_dir + sub + '/' + fname, 'r') as dataFile:
                        data = dataFile.read()
                        # Trim data from seriealized php string to JSON
                        data = data[data.rindex(
                            '_database_created_at')-2:len(data)-3]
                        # Parse it to a JSON object
                        data = json.loads(data)
                        # Get user data
                        sub_id = data['_user_data']['prolific_id']
                        age = data['_user_data']['self_reported_age']
                        gender = data['_user_data']['self_reported_gender']
                        blocks = data['ExperimentTable']['AllTrialsData']
                        # If subject data is not parsed already
                        if not (sub_id + '_ACF.csv') in os.listdir('Data/Parsed'):
                            with open(out_dir + sub_id + '_ACF.csv', 'w') as f:
                                csvWriter = csv.writer(f)
                                csvWriter.writerow(['id', 'age', 'gender', 'block', 'trial', 'targ_sq_color',
                                                    'targ_cir_color', 'targ_diamond_color', 'non_opt_targ_color',
                                                    'n_sq', 'n_cir', 'n_diamond', 'n_red', 'n_green', 'n_blue',
                                                    'optimality', 'run_len', 'run_number', 'rt', 'wrong_attempts'
                                                    ])
                                for bi in [6]:
                                    block = blocks[bi]
                                    for trial in block:
                                        if int(trial['blockTrial']) <= trials_per_block:
                                            # Calculate response data
                                            trial_response = trial['response']
                                            shapes = []
                                            colors = []
                                            for res in trial_response:
                                                targ = res['objectInfo']['className'].split(
                                                    '_')
                                                shapes.append(targ[1])
                                                colors.append(targ[2])
                                            sq = shapes.count('sq')
                                            cir = shapes.count('cir')
                                            dia = shapes.count('diamond')
                                            red = colors.count('red')
                                            green = colors.count('green')
                                            blue = colors.count('blue')
                                            # Get non-optimal color
                                            non_opt_color = 'red' if trial['logic']['non_opt_targ_color'] == 0 else 'green' if trial[
                                                'logic']['non_opt_targ_color'] == 1 else 'blue'
                                            # Calculate trial optimality
                                            p_non_opt = colors.count(
                                                non_opt_color)/len(colors)
                                            p_opt = 1 - p_non_opt
                                            trial_data = [
                                                sub_id,
                                                age,
                                                gender,
                                                trial['blockNumber'],
                                                trial['blockTrial'],
                                                trial['logic']['targ_sq_color'],
                                                trial['logic']['targ_cir_color'],
                                                trial['logic']['targ_diamond_color'],
                                                non_opt_color,
                                                sq,
                                                cir,
                                                dia,
                                                red,
                                                green,
                                                blue,
                                                p_opt,
                                                trial['run_length'],
                                                trial['run_number'],
                                                trial['rt'],
                                                trial['n_wrong_attempt'],

                                            ]
                                            csvWriter.writerow(trial_data)
                                print('Finished parsing subject ' + sub_id)


if __name__ == "__main__":
    main()
