import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as lodash from 'lodash';
import {
    MatSnackBar, MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { OperatorService } from '../operator/operator.service';

@Injectable({
    providedIn: 'root'
})
export class AnalyseFastService {
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(public http: HttpClient, private snackBar: MatSnackBar, private operatorService: OperatorService) { }
    // _________________________________Common Code Start_________________________________//
    // #region "Common Code"
    public countryData = [{ 'id': 4, 'name': 'Afghanistan', 'alpha2': 'af', 'alpha3': 'afg' },
    { 'id': 248, 'name': 'Åland Islands', 'alpha2': 'ax', 'alpha3': 'ala' },
    { 'id': 8, 'name': 'Albania', 'alpha2': 'al', 'alpha3': 'alb' },
    { 'id': 12, 'name': 'Algeria', 'alpha2': 'dz', 'alpha3': 'dza' },
    { 'id': 16, 'name': 'American Samoa', 'alpha2': 'as', 'alpha3': 'asm' },
    { 'id': 20, 'name': 'Andorra', 'alpha2': 'ad', 'alpha3': 'and' },
    { 'id': 24, 'name': 'Angola', 'alpha2': 'ao', 'alpha3': 'ago' },
    { 'id': 660, 'name': 'Anguilla', 'alpha2': 'ai', 'alpha3': 'aia' },
    { 'id': 10, 'name': 'Antarctica', 'alpha2': 'aq', 'alpha3': 'ata' },
    { 'id': 28, 'name': 'Antigua and Barbuda', 'alpha2': 'ag', 'alpha3': 'atg' },
    { 'id': 32, 'name': 'Argentina', 'alpha2': 'ar', 'alpha3': 'arg' },
    { 'id': 51, 'name': 'Armenia', 'alpha2': 'am', 'alpha3': 'arm' },
    { 'id': 533, 'name': 'Aruba', 'alpha2': 'aw', 'alpha3': 'abw' },
    { 'id': 36, 'name': 'Australia', 'alpha2': 'au', 'alpha3': 'aus' },
    { 'id': 40, 'name': 'Austria', 'alpha2': 'at', 'alpha3': 'aut' },
    { 'id': 31, 'name': 'Azerbaijan', 'alpha2': 'az', 'alpha3': 'aze' },
    { 'id': 44, 'name': 'Bahamas', 'alpha2': 'bs', 'alpha3': 'bhs' },
    { 'id': 48, 'name': 'Bahrain', 'alpha2': 'bh', 'alpha3': 'bhr' },
    { 'id': 50, 'name': 'Bangladesh', 'alpha2': 'bd', 'alpha3': 'bgd' },
    { 'id': 52, 'name': 'Barbados', 'alpha2': 'bb', 'alpha3': 'brb' },
    { 'id': 112, 'name': 'Belarus', 'alpha2': 'by', 'alpha3': 'blr' },
    { 'id': 56, 'name': 'Belgium', 'alpha2': 'be', 'alpha3': 'bel' },
    { 'id': 84, 'name': 'Belize', 'alpha2': 'bz', 'alpha3': 'blz' },
    { 'id': 204, 'name': 'Benin', 'alpha2': 'bj', 'alpha3': 'ben' },
    { 'id': 60, 'name': 'Bermuda', 'alpha2': 'bm', 'alpha3': 'bmu' },
    { 'id': 64, 'name': 'Bhutan', 'alpha2': 'bt', 'alpha3': 'btn' },
    { 'id': 68, 'name': 'Bolivia (Plurinational State of)', 'alpha2': 'bo', 'alpha3': 'bol' },
    { 'id': 535, 'name': 'Bonaire, Sint Eustatius and Saba', 'alpha2': 'bq', 'alpha3': 'bes' },
    { 'id': 70, 'name': 'Bosnia and Herzegovina', 'alpha2': 'ba', 'alpha3': 'bih' },
    { 'id': 72, 'name': 'Botswana', 'alpha2': 'bw', 'alpha3': 'bwa' },
    { 'id': 74, 'name': 'Bouvet Island', 'alpha2': 'bv', 'alpha3': 'bvt' },
    { 'id': 76, 'name': 'Brazil', 'alpha2': 'br', 'alpha3': 'bra' },
    { 'id': 86, 'name': 'British Indian Ocean Territory', 'alpha2': 'io', 'alpha3': 'iot' },
    { 'id': 96, 'name': 'Brunei Darussalam', 'alpha2': 'bn', 'alpha3': 'brn' },
    { 'id': 100, 'name': 'Bulgaria', 'alpha2': 'bg', 'alpha3': 'bgr' },
    { 'id': 854, 'name': 'Burkina Faso', 'alpha2': 'bf', 'alpha3': 'bfa' },
    { 'id': 108, 'name': 'Burundi', 'alpha2': 'bi', 'alpha3': 'bdi' },
    { 'id': 132, 'name': 'Cabo Verde', 'alpha2': 'cv', 'alpha3': 'cpv' },
    { 'id': 116, 'name': 'Cambodia', 'alpha2': 'kh', 'alpha3': 'khm' },
    { 'id': 120, 'name': 'Cameroon', 'alpha2': 'cm', 'alpha3': 'cmr' },
    { 'id': 124, 'name': 'Canada', 'alpha2': 'ca', 'alpha3': 'can' },
    { 'id': 136, 'name': 'Cayman Islands', 'alpha2': 'ky', 'alpha3': 'cym' },
    { 'id': 140, 'name': 'Central African Republic', 'alpha2': 'cf', 'alpha3': 'caf' },
    { 'id': 148, 'name': 'Chad', 'alpha2': 'td', 'alpha3': 'tcd' },
    { 'id': 152, 'name': 'Chile', 'alpha2': 'cl', 'alpha3': 'chl' },
    { 'id': 156, 'name': 'China', 'alpha2': 'cn', 'alpha3': 'chn' },
    { 'id': 162, 'name': 'Christmas Island', 'alpha2': 'cx', 'alpha3': 'cxr' },
    { 'id': 166, 'name': 'Cocos (Keeling) Islands', 'alpha2': 'cc', 'alpha3': 'cck' },
    { 'id': 170, 'name': 'Colombia', 'alpha2': 'co', 'alpha3': 'col' },
    { 'id': 174, 'name': 'Comoros', 'alpha2': 'km', 'alpha3': 'com' },
    { 'id': 178, 'name': 'Congo', 'alpha2': 'cg', 'alpha3': 'cog' },
    { 'id': 180, 'name': 'Congo, Democratic Republic of the', 'alpha2': 'cd', 'alpha3': 'cod' },
    { 'id': 184, 'name': 'Cook Islands', 'alpha2': 'ck', 'alpha3': 'cok' },
    { 'id': 188, 'name': 'Costa Rica', 'alpha2': 'cr', 'alpha3': 'cri' },
    { 'id': 384, 'name': 'Côte d Ivoire', 'alpha2': 'ci', 'alpha3': 'civ' },
    { 'id': 191, 'name': 'Croatia', 'alpha2': 'hr', 'alpha3': 'hrv' },
    { 'id': 192, 'name': 'Cuba', 'alpha2': 'cu', 'alpha3': 'cub' },
    { 'id': 531, 'name': 'Curaçao', 'alpha2': 'cw', 'alpha3': 'cuw' },
    { 'id': 196, 'name': 'Cyprus', 'alpha2': 'cy', 'alpha3': 'cyp' },
    { 'id': 203, 'name': 'Czechia', 'alpha2': 'cz', 'alpha3': 'cze' },
    { 'id': 208, 'name': 'Denmark', 'alpha2': 'dk', 'alpha3': 'dnk' },
    { 'id': 262, 'name': 'Djibouti', 'alpha2': 'dj', 'alpha3': 'dji' },
    { 'id': 212, 'name': 'Dominica', 'alpha2': 'dm', 'alpha3': 'dma' },
    { 'id': 214, 'name': 'Dominican Republic', 'alpha2': 'do', 'alpha3': 'dom' },
    { 'id': 218, 'name': 'Ecuador', 'alpha2': 'ec', 'alpha3': 'ecu' },
    { 'id': 818, 'name': 'Egypt', 'alpha2': 'eg', 'alpha3': 'egy' },
    { 'id': 222, 'name': 'El Salvador', 'alpha2': 'sv', 'alpha3': 'slv' },
    { 'id': 226, 'name': 'Equatorial Guinea', 'alpha2': 'gq', 'alpha3': 'gnq' },
    { 'id': 232, 'name': 'Eritrea', 'alpha2': 'er', 'alpha3': 'eri' },
    { 'id': 233, 'name': 'Estonia', 'alpha2': 'ee', 'alpha3': 'est' },
    { 'id': 748, 'name': 'Eswatini', 'alpha2': 'sz', 'alpha3': 'swz' },
    { 'id': 231, 'name': 'Ethiopia', 'alpha2': 'et', 'alpha3': 'eth' },
    { 'id': 238, 'name': 'Falkland Islands (Malvinas)', 'alpha2': 'fk', 'alpha3': 'flk' },
    { 'id': 234, 'name': 'Faroe Islands', 'alpha2': 'fo', 'alpha3': 'fro' },
    { 'id': 242, 'name': 'Fiji', 'alpha2': 'fj', 'alpha3': 'fji' },
    { 'id': 246, 'name': 'Finland', 'alpha2': 'fi', 'alpha3': 'fin' },
    { 'id': 250, 'name': 'France', 'alpha2': 'fr', 'alpha3': 'fra' },
    { 'id': 254, 'name': 'French Guiana', 'alpha2': 'gf', 'alpha3': 'guf' },
    { 'id': 258, 'name': 'French Polynesia', 'alpha2': 'pf', 'alpha3': 'pyf' },
    { 'id': 260, 'name': 'French Southern Territories', 'alpha2': 'tf', 'alpha3': 'atf' },
    { 'id': 266, 'name': 'Gabon', 'alpha2': 'ga', 'alpha3': 'gab' },
    { 'id': 270, 'name': 'Gambia', 'alpha2': 'gm', 'alpha3': 'gmb' },
    { 'id': 268, 'name': 'Georgia', 'alpha2': 'ge', 'alpha3': 'geo' },
    { 'id': 276, 'name': 'Germany', 'alpha2': 'de', 'alpha3': 'deu' },
    { 'id': 288, 'name': 'Ghana', 'alpha2': 'gh', 'alpha3': 'gha' },
    { 'id': 292, 'name': 'Gibraltar', 'alpha2': 'gi', 'alpha3': 'gib' },
    { 'id': 300, 'name': 'Greece', 'alpha2': 'gr', 'alpha3': 'grc' },
    { 'id': 304, 'name': 'Greenland', 'alpha2': 'gl', 'alpha3': 'grl' },
    { 'id': 308, 'name': 'Grenada', 'alpha2': 'gd', 'alpha3': 'grd' },
    { 'id': 312, 'name': 'Guadeloupe', 'alpha2': 'gp', 'alpha3': 'glp' },
    { 'id': 316, 'name': 'Guam', 'alpha2': 'gu', 'alpha3': 'gum' },
    { 'id': 320, 'name': 'Guatemala', 'alpha2': 'gt', 'alpha3': 'gtm' },
    { 'id': 831, 'name': 'Guernsey', 'alpha2': 'gg', 'alpha3': 'ggy' },
    { 'id': 324, 'name': 'Guinea', 'alpha2': 'gn', 'alpha3': 'gin' },
    { 'id': 624, 'name': 'Guinea-Bissau', 'alpha2': 'gw', 'alpha3': 'gnb' },
    { 'id': 328, 'name': 'Guyana', 'alpha2': 'gy', 'alpha3': 'guy' },
    { 'id': 332, 'name': 'Haiti', 'alpha2': 'ht', 'alpha3': 'hti' },
    { 'id': 334, 'name': 'Heard Island and McDonald Islands', 'alpha2': 'hm', 'alpha3': 'hmd' },
    { 'id': 336, 'name': 'Holy See', 'alpha2': 'va', 'alpha3': 'vat' },
    { 'id': 340, 'name': 'Honduras', 'alpha2': 'hn', 'alpha3': 'hnd' },
    { 'id': 344, 'name': 'Hong Kong', 'alpha2': 'hk', 'alpha3': 'hkg' },
    { 'id': 348, 'name': 'Hungary', 'alpha2': 'hu', 'alpha3': 'hun' },
    { 'id': 352, 'name': 'Iceland', 'alpha2': 'is', 'alpha3': 'isl' },
    { 'id': 356, 'name': 'India', 'alpha2': 'in', 'alpha3': 'ind' },
    { 'id': 360, 'name': 'Indonesia', 'alpha2': 'id', 'alpha3': 'idn' },
    { 'id': 364, 'name': 'Iran (Islamic Republic of)', 'alpha2': 'ir', 'alpha3': 'irn' },
    { 'id': 368, 'name': 'Iraq', 'alpha2': 'iq', 'alpha3': 'irq' },
    { 'id': 372, 'name': 'Ireland', 'alpha2': 'ie', 'alpha3': 'irl' },
    { 'id': 833, 'name': 'Isle of Man', 'alpha2': 'im', 'alpha3': 'imn' },
    { 'id': 376, 'name': 'Israel', 'alpha2': 'il', 'alpha3': 'isr' },
    { 'id': 380, 'name': 'Italy', 'alpha2': 'it', 'alpha3': 'ita' },
    { 'id': 388, 'name': 'Jamaica', 'alpha2': 'jm', 'alpha3': 'jam' },
    { 'id': 392, 'name': 'Japan', 'alpha2': 'jp', 'alpha3': 'jpn' },
    { 'id': 832, 'name': 'Jersey', 'alpha2': 'je', 'alpha3': 'jey' },
    { 'id': 400, 'name': 'Jordan', 'alpha2': 'jo', 'alpha3': 'jor' },
    { 'id': 398, 'name': 'Kazakhstan', 'alpha2': 'kz', 'alpha3': 'kaz' },
    { 'id': 404, 'name': 'Kenya', 'alpha2': 'ke', 'alpha3': 'ken' },
    { 'id': 296, 'name': 'Kiribati', 'alpha2': 'ki', 'alpha3': 'kir' },
    { 'id': 408, 'name': 'Korea (Democratic Peoples Republic of) ', 'alpha2': 'kp', 'alpha3': 'prk' },
    { 'id': 410, 'name': 'Korea, Republic of', 'alpha2': 'kr', 'alpha3': 'kor' },
    { 'id': 414, 'name': 'Kuwait', 'alpha2': 'kw', 'alpha3': 'kwt' },
    { 'id': 417, 'name': 'Kyrgyzstan', 'alpha2': 'kg', 'alpha3': 'kgz' },
    { 'id': 418, 'name': 'Lao Peoples Democratic Republic', 'alpha2': 'la', 'alpha3': 'lao' },
    { 'id': 428, 'name': 'Latvia', 'alpha2': 'lv', 'alpha3': 'lva' },
    { 'id': 422, 'name': 'Lebanon', 'alpha2': 'lb', 'alpha3': 'lbn' },
    { 'id': 426, 'name': 'Lesotho', 'alpha2': 'ls', 'alpha3': 'lso' },
    { 'id': 430, 'name': 'Liberia', 'alpha2': 'lr', 'alpha3': 'lbr' },
    { 'id': 434, 'name': 'Libya', 'alpha2': 'ly', 'alpha3': 'lby' },
    { 'id': 438, 'name': 'Liechtenstein', 'alpha2': 'li', 'alpha3': 'lie' },
    { 'id': 440, 'name': 'Lithuania', 'alpha2': 'lt', 'alpha3': 'ltu' },
    { 'id': 442, 'name': 'Luxembourg', 'alpha2': 'lu', 'alpha3': 'lux' },
    { 'id': 446, 'name': 'Macao', 'alpha2': 'mo', 'alpha3': 'mac' },
    { 'id': 450, 'name': 'Madagascar', 'alpha2': 'mg', 'alpha3': 'mdg' },
    { 'id': 454, 'name': 'Malawi', 'alpha2': 'mw', 'alpha3': 'mwi' },
    { 'id': 458, 'name': 'Malaysia', 'alpha2': 'my', 'alpha3': 'mys' },
    { 'id': 462, 'name': 'Maldives', 'alpha2': 'mv', 'alpha3': 'mdv' },
    { 'id': 466, 'name': 'Mali', 'alpha2': 'ml', 'alpha3': 'mli' },
    { 'id': 470, 'name': 'Malta', 'alpha2': 'mt', 'alpha3': 'mlt' },
    { 'id': 584, 'name': 'Marshall Islands', 'alpha2': 'mh', 'alpha3': 'mhl' },
    { 'id': 474, 'name': 'Martinique', 'alpha2': 'mq', 'alpha3': 'mtq' },
    { 'id': 478, 'name': 'Mauritania', 'alpha2': 'mr', 'alpha3': 'mrt' },
    { 'id': 480, 'name': 'Mauritius', 'alpha2': 'mu', 'alpha3': 'mus' },
    { 'id': 175, 'name': 'Mayotte', 'alpha2': 'yt', 'alpha3': 'myt' },
    { 'id': 484, 'name': 'Mexico', 'alpha2': 'mx', 'alpha3': 'mex' },
    { 'id': 583, 'name': 'Micronesia (Federated States of)', 'alpha2': 'fm', 'alpha3': 'fsm' },
    { 'id': 498, 'name': 'Moldova, Republic of', 'alpha2': 'md', 'alpha3': 'mda' },
    { 'id': 492, 'name': 'Monaco', 'alpha2': 'mc', 'alpha3': 'mco' },
    { 'id': 496, 'name': 'Mongolia', 'alpha2': 'mn', 'alpha3': 'mng' },
    { 'id': 499, 'name': 'Montenegro', 'alpha2': 'me', 'alpha3': 'mne' },
    { 'id': 500, 'name': 'Montserrat', 'alpha2': 'ms', 'alpha3': 'msr' },
    { 'id': 504, 'name': 'Morocco', 'alpha2': 'ma', 'alpha3': 'mar' },
    { 'id': 508, 'name': 'Mozambique', 'alpha2': 'mz', 'alpha3': 'moz' },
    { 'id': 104, 'name': 'Myanmar', 'alpha2': 'mm', 'alpha3': 'mmr' },
    { 'id': 516, 'name': 'Namibia', 'alpha2': 'na', 'alpha3': 'nam' },
    { 'id': 520, 'name': 'Nauru', 'alpha2': 'nr', 'alpha3': 'nru' },
    { 'id': 524, 'name': 'Nepal', 'alpha2': 'np', 'alpha3': 'npl' },
    { 'id': 528, 'name': 'Netherlands', 'alpha2': 'nl', 'alpha3': 'nld' },
    { 'id': 540, 'name': 'New Caledonia', 'alpha2': 'nc', 'alpha3': 'ncl' },
    { 'id': 554, 'name': 'New Zealand', 'alpha2': 'nz', 'alpha3': 'nzl' },
    { 'id': 558, 'name': 'Nicaragua', 'alpha2': 'ni', 'alpha3': 'nic' },
    { 'id': 562, 'name': 'Niger', 'alpha2': 'ne', 'alpha3': 'ner' },
    { 'id': 566, 'name': 'Nigeria', 'alpha2': 'ng', 'alpha3': 'nga' },
    { 'id': 570, 'name': 'Niue', 'alpha2': 'nu', 'alpha3': 'niu' },
    { 'id': 574, 'name': 'Norfolk Island', 'alpha2': 'nf', 'alpha3': 'nfk' },
    { 'id': 807, 'name': 'North Macedonia', 'alpha2': 'mk', 'alpha3': 'mkd' },
    { 'id': 580, 'name': 'Northern Mariana Islands', 'alpha2': 'mp', 'alpha3': 'mnp' },
    { 'id': 578, 'name': 'Norway', 'alpha2': 'no', 'alpha3': 'nor' },
    { 'id': 512, 'name': 'Oman', 'alpha2': 'om', 'alpha3': 'omn' },
    { 'id': 586, 'name': 'Pakistan', 'alpha2': 'pk', 'alpha3': 'pak' },
    { 'id': 585, 'name': 'Palau', 'alpha2': 'pw', 'alpha3': 'plw' },
    { 'id': 275, 'name': 'Palestine, State of', 'alpha2': 'ps', 'alpha3': 'pse' },
    { 'id': 591, 'name': 'Panama', 'alpha2': 'pa', 'alpha3': 'pan' },
    { 'id': 598, 'name': 'Papua New Guinea', 'alpha2': 'pg', 'alpha3': 'png' },
    { 'id': 600, 'name': 'Paraguay', 'alpha2': 'py', 'alpha3': 'pry' },
    { 'id': 604, 'name': 'Peru', 'alpha2': 'pe', 'alpha3': 'per' },
    { 'id': 608, 'name': 'Philippines', 'alpha2': 'ph', 'alpha3': 'phl' },
    { 'id': 612, 'name': 'Pitcairn', 'alpha2': 'pn', 'alpha3': 'pcn' },
    { 'id': 616, 'name': 'Poland', 'alpha2': 'pl', 'alpha3': 'pol' },
    { 'id': 620, 'name': 'Portugal', 'alpha2': 'pt', 'alpha3': 'prt' },
    { 'id': 630, 'name': 'Puerto Rico', 'alpha2': 'pr', 'alpha3': 'pri' },
    { 'id': 634, 'name': 'Qatar', 'alpha2': 'qa', 'alpha3': 'qat' },
    { 'id': 638, 'name': 'Réunion', 'alpha2': 're', 'alpha3': 'reu' },
    { 'id': 642, 'name': 'Romania', 'alpha2': 'ro', 'alpha3': 'rou' },
    { 'id': 643, 'name': 'Russian Federation', 'alpha2': 'ru', 'alpha3': 'rus' },
    { 'id': 646, 'name': 'Rwanda', 'alpha2': 'rw', 'alpha3': 'rwa' },
    { 'id': 652, 'name': 'Saint Barthélemy', 'alpha2': 'bl', 'alpha3': 'blm' },
    { 'id': 654, 'name': 'Saint Helena, Ascension and Tristan da Cunha', 'alpha2': 'sh', 'alpha3': 'shn' },
    { 'id': 659, 'name': 'Saint Kitts and Nevis', 'alpha2': 'kn', 'alpha3': 'kna' },
    { 'id': 662, 'name': 'Saint Lucia', 'alpha2': 'lc', 'alpha3': 'lca' },
    { 'id': 663, 'name': 'Saint Martin (French part)', 'alpha2': 'mf', 'alpha3': 'maf' },
    { 'id': 666, 'name': 'Saint Pierre and Miquelon', 'alpha2': 'pm', 'alpha3': 'spm' },
    { 'id': 670, 'name': 'Saint Vincent and the Grenadines', 'alpha2': 'vc', 'alpha3': 'vct' },
    { 'id': 882, 'name': 'Samoa', 'alpha2': 'ws', 'alpha3': 'wsm' },
    { 'id': 674, 'name': 'San Marino', 'alpha2': 'sm', 'alpha3': 'smr' },
    { 'id': 678, 'name': 'Sao Tome and Principe', 'alpha2': 'st', 'alpha3': 'stp' },
    { 'id': 682, 'name': 'Saudi Arabia', 'alpha2': 'sa', 'alpha3': 'sau' },
    { 'id': 686, 'name': 'Senegal', 'alpha2': 'sn', 'alpha3': 'sen' },
    { 'id': 688, 'name': 'Serbia', 'alpha2': 'rs', 'alpha3': 'srb' },
    { 'id': 690, 'name': 'Seychelles', 'alpha2': 'sc', 'alpha3': 'syc' },
    { 'id': 694, 'name': 'Sierra Leone', 'alpha2': 'sl', 'alpha3': 'sle' },
    { 'id': 702, 'name': 'Singapore', 'alpha2': 'sg', 'alpha3': 'sgp' },
    { 'id': 534, 'name': 'Sint Maarten (Dutch part)', 'alpha2': 'sx', 'alpha3': 'sxm' },
    { 'id': 703, 'name': 'Slovakia', 'alpha2': 'sk', 'alpha3': 'svk' },
    { 'id': 705, 'name': 'Slovenia', 'alpha2': 'si', 'alpha3': 'svn' },
    { 'id': 90, 'name': 'Solomon Islands', 'alpha2': 'sb', 'alpha3': 'slb' },
    { 'id': 706, 'name': 'Somalia', 'alpha2': 'so', 'alpha3': 'som' },
    { 'id': 710, 'name': 'South Africa', 'alpha2': 'za', 'alpha3': 'zaf' },
    { 'id': 239, 'name': 'South Georgia and the South Sandwich Islands', 'alpha2': 'gs', 'alpha3': 'sgs' },
    { 'id': 728, 'name': 'South Sudan', 'alpha2': 'ss', 'alpha3': 'ssd' },
    { 'id': 724, 'name': 'Spain', 'alpha2': 'es', 'alpha3': 'esp' },
    { 'id': 144, 'name': 'Sri Lanka', 'alpha2': 'lk', 'alpha3': 'lka' },
    { 'id': 729, 'name': 'Sudan', 'alpha2': 'sd', 'alpha3': 'sdn' },
    { 'id': 740, 'name': 'Suriname', 'alpha2': 'sr', 'alpha3': 'sur' },
    { 'id': 744, 'name': 'Svalbard and Jan Mayen', 'alpha2': 'sj', 'alpha3': 'sjm' },
    { 'id': 752, 'name': 'Sweden', 'alpha2': 'se', 'alpha3': 'swe' },
    { 'id': 756, 'name': 'Switzerland', 'alpha2': 'ch', 'alpha3': 'che' },
    { 'id': 760, 'name': 'Syrian Arab Republic', 'alpha2': 'sy', 'alpha3': 'syr' },
    { 'id': 158, 'name': 'Taiwan, Province of China', 'alpha2': 'tw', 'alpha3': 'twn' },
    { 'id': 762, 'name': 'Tajikistan', 'alpha2': 'tj', 'alpha3': 'tjk' },
    { 'id': 834, 'name': 'Tanzania, United Republic of', 'alpha2': 'tz', 'alpha3': 'tza' },
    { 'id': 764, 'name': 'Thailand', 'alpha2': 'th', 'alpha3': 'tha' },
    { 'id': 626, 'name': 'Timor-Leste', 'alpha2': 'tl', 'alpha3': 'tls' },
    { 'id': 768, 'name': 'Togo', 'alpha2': 'tg', 'alpha3': 'tgo' },
    { 'id': 772, 'name': 'Tokelau', 'alpha2': 'tk', 'alpha3': 'tkl' },
    { 'id': 776, 'name': 'Tonga', 'alpha2': 'to', 'alpha3': 'ton' },
    { 'id': 780, 'name': 'Trinidad and Tobago', 'alpha2': 'tt', 'alpha3': 'tto' },
    { 'id': 788, 'name': 'Tunisia', 'alpha2': 'tn', 'alpha3': 'tun' },
    { 'id': 792, 'name': 'Turkey', 'alpha2': 'tr', 'alpha3': 'tur' },
    { 'id': 795, 'name': 'Turkmenistan', 'alpha2': 'tm', 'alpha3': 'tkm' },
    { 'id': 796, 'name': 'Turks and Caicos Islands', 'alpha2': 'tc', 'alpha3': 'tca' },
    { 'id': 798, 'name': 'Tuvalu', 'alpha2': 'tv', 'alpha3': 'tuv' },
    { 'id': 800, 'name': 'Uganda', 'alpha2': 'ug', 'alpha3': 'uga' },
    { 'id': 804, 'name': 'Ukraine', 'alpha2': 'ua', 'alpha3': 'ukr' },
    { 'id': 784, 'name': 'United Arab Emirates', 'alpha2': 'ae', 'alpha3': 'are' },
    { 'id': 826, 'name': 'United Kingdom of Great Britain and Northern Ireland', 'alpha2': 'gb', 'alpha3': 'gbr' },
    { 'id': 840, 'name': 'United States of America', 'alpha2': 'us', 'alpha3': 'usa' },
    { 'id': 581, 'name': 'United States Minor Outlying Islands', 'alpha2': 'um', 'alpha3': 'umi' },
    { 'id': 858, 'name': 'Uruguay', 'alpha2': 'uy', 'alpha3': 'ury' },
    { 'id': 860, 'name': 'Uzbekistan', 'alpha2': 'uz', 'alpha3': 'uzb' },
    { 'id': 548, 'name': 'Vanuatu', 'alpha2': 'vu', 'alpha3': 'vut' },
    { 'id': 862, 'name': 'Venezuela (Bolivarian Republic of)', 'alpha2': 've', 'alpha3': 'ven' },
    { 'id': 704, 'name': 'Viet Nam', 'alpha2': 'vn', 'alpha3': 'vnm' },
    { 'id': 92, 'name': 'Virgin Islands (British)', 'alpha2': 'vg', 'alpha3': 'vgb' },
    { 'id': 850, 'name': 'Virgin Islands (U.S.)', 'alpha2': 'vi', 'alpha3': 'vir' },
    { 'id': 876, 'name': 'Wallis and Futuna', 'alpha2': 'wf', 'alpha3': 'wlf' },
    { 'id': 732, 'name': 'Western Sahara', 'alpha2': 'eh', 'alpha3': 'esh' },
    { 'id': 887, 'name': 'Yemen', 'alpha2': 'ye', 'alpha3': 'yem' },
    { 'id': 894, 'name': 'Zambia', 'alpha2': 'zm', 'alpha3': 'zmb' },
    { 'id': 716, 'name': 'Zimbabwe', 'alpha2': 'zw', 'alpha3': 'zwe' }];

    public VarianceList = [{ 'ID': 1, 'Value': 'Budget' }, { 'ID': 2, 'Value': 'Baseline' }];

    // numFmtr(num) {
    //     // if (num > 999 && num < 1000000) {
    //     //   return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million
    //     // } else
    //     let isNegative = false;
    //     if (num < 0) {
    //         isNegative = true;
    //         num = num * -1;
    //     }
    //     if (num > 900) {
    //         num = (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million
    //     }
    //     return isNegative ? '-' + num : num.toString();
    // }


    numFmtr(num) {

        let isNegative = false;
        if (num < 0) {
            isNegative = true;
            num = num * -1;
        }
        if (num >= 1000000000) {
            num = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        else if (num >= 1000000) {
            num = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        else if (num >= 1000) {
            num = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return isNegative ? '-' + num : num.toString();
    }

    // #endregion

    // __________________________________Screen1 Start_________________________________//
    // #region "AnalyseFast Scree1"
    InboundOutBound = [];
    summery = {};
    public TotalUpdatedtrafficsplit = 0;
    public periods = [
        { ID: 1, Value: 'Forcasted' },
        { ID: 2, Value: 'Current (YtD)' }
    ];
    public direction = [
        { ID: 1, Value: 'Inbound' },
        { ID: 2, Value: 'Outbound' }
    ];
    public discountType = [
        { ID: 1, Value: 'Balanced / Unbalanced' },
        { ID: 2, Value: 'AYCE' },
        { ID: 3, Value: 'Flat Rate' },
        { ID: 4, Value: 'Banded Tied' }
    ];
    public dealType = [
        { ID: 4, Value: 'IOT Discount' },
        { ID: 5, Value: 'NB-IoT' },
        { ID: 6, Value: 'LTE-M' },
        { ID: 7, Value: 'M-IoT' }
    ];

    public deals = [
        { ID: 1, Value: 'Completed deals' },
        { ID: 2, Value: 'Negotiations in progress' },
        { ID: 3, Value: 'No deals' }
    ];
    public itemdata = [
        { id: 'RU', value: 4352 },
        { id: 'US', value: 424 },
        { id: 'FR', value: 325 },
        { id: 'CA', value: 25 },
        { id: 'IN', value: 542 }
    ];

    public groups = [];
    public types = [{ ID: 1, Value: 'All' },
    { ID: 2, Value: 'Groups' }];
    public dropdownSettingsPeriod = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false,
    };
    public dropdownSettingsDirection = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false,
    };
    public dropdownSettingsDeals = {
        singleSelection: false,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false
    };
    public dropdownSettingsDealType = {
        singleSelection: false,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false,
        limitSelection: 1
    };
    public dropdownSettingsGroups = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false,
    };
    public dropdownSettingsTypes = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false,
    };

    public varianceInbound;
    public varianceOutbound;
    public IsGroupScreen = false;
    bindScreen1(formgroup?, item?) {
        const newScreen1Form = new FormGroup({
            'Types': new FormControl((item && item.Types) ? item.Types : ''),
            'Group': new FormControl((item && item.Group) ? item.Group : ''),
            'Period': new FormControl((item && item.Period) ? item.Period : ''),
            'DatePeriod': new FormControl((item && item.DatePeriod) ? item.DatePeriod : ''),
            'Direction': new FormControl((item && item.Direction) ? item.Direction : ''),
            'DealType': new FormControl((item && item.DealType) ? item.DealType : ''),
            'Deal': new FormControl((item && item.Deal) ? item.Deal : ''),
            'InboundOutBound': this.bindInboundOutbound(formgroup, item),
            'Net': new FormArray([]),
            'IsCountry': new FormControl((item && item.IsCountry) ? item.IsCountry : false),
        });
        return newScreen1Form;
    }

    bindInboundOutbound(newScreen1Form?, item?): FormArray {
        this.bindData(newScreen1Form, item);
        const bindInboundOutbound = new FormArray([]);
        return bindInboundOutbound;
    }

    getGroups(userId): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!(this.groups && this.groups.length > 0)) {
                this.operatorService
                    .getCounterParty(2, userId)
                    .then(p => {
                        this.groups = p.result.map(x => {
                            return {
                                'ID': x.OperatorIds,
                                'Value': x.OperatorName,
                                "TCID": x.TCID,
                            }
                        });
                    });
            }
            return resolve(this.groups);
        });

    }

    bindData(newScreen1Form?, item?) {
        let Period = item ? item.Period[0].ID : this.Screen1DataModel().Period[0].ID;
        let Direction = item ? item.Direction[0].ID : this.Screen1DataModel().Direction[0].ID;
        if (newScreen1Form && newScreen1Form.get('Period') && newScreen1Form.get('Period') &&
            newScreen1Form.get('Period').value && newScreen1Form.get('Direction').value) {
            Period = newScreen1Form.get('Period').value[0].ID;
            Direction = newScreen1Form.get('Direction').value[0].ID;
        }

        this.InboundOutBound = [];
        this.summery = {};
        if (Period === 1 && Direction === 1) {
            this.InboundOutBound = this.Screen1DataModel().ForcastedInbound;
            this.summery = this.Screen1DataModel().ForcastedInboundSummury;
        } else if (Period === 2 && Direction === 1) {
            this.InboundOutBound = this.Screen1DataModel().CurruntInbound;
            this.summery = this.Screen1DataModel().CurruntInboundSummury;
        } else if (Period === 1 && Direction === 2) {
            this.InboundOutBound = this.Screen1DataModel().ForcastedOutbound;
            this.summery = this.Screen1DataModel().ForcastedOutboundSummury;
        } else if (Period === 2 && Direction === 2) {
            this.InboundOutBound = this.Screen1DataModel().CurruntOutbound;
            this.summery = this.Screen1DataModel().CurruntOutBoundSummury;
        }
    }
    Screen1DataModel() {
        const CurruntOutbound = [
            {
                'ID': 1,
                'Name': 'China',
                'ISO': 'CHN',
                'Voice': {
                    'TotalCost': 1879,
                    'TotalUsage': 6532,
                    'Price/Unit': 0.2877,
                },
                'SMS': {
                    'TotalCost': 235
                    , 'TotalUsage': 2345
                    , 'Price/Unit': 0.1002
                },
                'Data': {
                    'TotalCost': 56789
                    , 'TotalUsage': 65843
                    , 'Price/Unit': 0.00084228
                },
                'Total': {
                    'TotalCost': 58903
                }
            },
            {
                'ID': 2,
                'Name': 'Australia',
                'ISO': 'AUS',
                'Voice': {
                    'TotalCost': 1243,
                    'TotalUsage': 1737,
                    'Price/Unit': 0.7157,
                },
                'SMS': {
                    'TotalCost': 213
                    , 'TotalUsage': 2432
                    , 'Price/Unit': 0.0875
                },
                'Data': {
                    'TotalCost': 44093
                    , 'TotalUsage': 66144
                    , 'Price/Unit': 0.0006510
                },
                'Total': {
                    'TotalCost': 45549
                }
            },
            {
                'ID': 3,
                'Name': 'France',
                'ISO': 'FRA',
                'Voice': {
                    'TotalCost': 917,
                    'TotalUsage': 3294,
                    'Price/Unit': 0.2784,
                },
                'SMS': {
                    'TotalCost': 267
                    , 'TotalUsage': 4654
                    , 'Price/Unit': 0.0574
                },
                'Data': {
                    'TotalCost': 29017
                    , 'TotalUsage': 30169
                    , 'Price/Unit': 0.0009393

                },
                'Total': {
                    'TotalCost': 30201
                }
            },
            {
                'ID': 4,
                'Name': 'India',
                'ISO': 'IND',
                'Voice': {
                    'TotalCost': 2048,
                    'TotalUsage': 2096,
                    'Price/Unit': 0.9769,
                },
                'SMS': {
                    'TotalCost': 257
                    , 'TotalUsage': 3501
                    , 'Price/Unit': 0.0733
                },
                'Data': {
                    'TotalCost': 13421
                    , 'TotalUsage': 18453
                    , 'Price/Unit': 0.0007103
                },
                'Total': {
                    'TotalCost': 15726
                }
            },
            {
                'ID': 5,
                'Name': 'Mexico',
                'ISO': 'MEX',
                'Voice': {
                    'TotalCost': 1060,
                    'TotalUsage': 782,
                    'Price/Unit': 1.3555,
                },
                'SMS': {
                    'TotalCost': 210
                    , 'TotalUsage': 1507
                    , 'Price/Unit': 0.1391
                },
                'Data': {
                    'TotalCost': 13754
                    , 'TotalUsage': 12943
                    , 'Price/Unit': 0.0010378
                },
                'Total': {
                    'TotalCost': 15024
                }
            }
        ];

        const ForcastedOutbound = [

            {
                'ID': 1,
                'Name': 'Australia',
                'ISO': 'AUS',
                'Voice': {
                    'TotalCost': 73470,
                    'TotalUsage': 52314,
                    'Price/Unit': 1.4044,
                },
                'SMS': {
                    'TotalCost': 223
                    , 'TotalUsage': 7683
                    , 'Price/Unit': 0.0290
                },
                'Data': {
                    'TotalCost': 104352
                    , 'TotalUsage': 352540
                    , 'Price/Unit': 0.00028906
                },
                'Total': {
                    'TotalCost': 178045
                }
            },
            {
                'ID': 2,
                'Name': 'France',
                'ISO': 'FRA',
                'Voice': {
                    'TotalCost': 4223,
                    'TotalUsage': 4342,
                    'Price/Unit': 0.9726,
                },
                'SMS': {
                    'TotalCost': 532
                    , 'TotalUsage': 6745
                    , 'Price/Unit': 0.0789
                },
                'Data': {
                    'TotalCost': 135232
                    , 'TotalUsage': 165360
                    , 'Price/Unit': 0.00079864
                },
                'Total': {
                    'TotalCost': 139987
                }
            },
            {
                'ID': 3,
                'Name': 'China',
                'ISO': 'CHN',
                'Voice': {
                    'TotalCost': 1542,
                    'TotalUsage': 8234,
                    'Price/Unit': 0.1873,
                },
                'SMS': {
                    'TotalCost': 526
                    , 'TotalUsage': 5323
                    , 'Price/Unit': 0.0988
                },
                'Data': {
                    'TotalCost': 122542
                    , 'TotalUsage': 75423
                    , 'Price/Unit': 0.00158665
                },
                'Total': {
                    'TotalCost': 124610
                }
            }, {
                'ID': 4,
                'Name': 'canada',
                'ISO': 'CAN',
                'Voice': {
                    'TotalCost': 5120,
                    'TotalUsage': 5241,
                    'Price/Unit': 0.9769,
                },
                'SMS': {
                    'TotalCost': 642
                    , 'TotalUsage': 8753
                    , 'Price/Unit': 0.0733
                },
                'Data': {
                    'TotalCost': 84432
                    , 'TotalUsage': 54353
                    , 'Price/Unit': 0.00151699
                },
                'Total': {
                    'TotalCost': 90194
                }
            },
            {
                'ID': 5,
                'Name': 'Tanzania',
                'ISO': 'TZA',
                'Voice': {
                    'TotalCost': 15640,
                    'TotalUsage': 13420,
                    'Price/Unit': 1.1654,
                },
                'SMS': {
                    'TotalCost': 524
                    , 'TotalUsage': 3267
                    , 'Price/Unit': 0.1604
                },
                'Data': {
                    'TotalCost': 72431
                    , 'TotalUsage': 45334
                    , 'Price/Unit': 0.00156027
                },
                'Total': {
                    'TotalCost': 88595
                }
            }

        ];

        const CurruntInbound = [
            {
                'ID': 1,
                'Name': 'Russia',
                'ISO': 'RUS',
                'Voice': {
                    'TotalCost': 939,
                    'TotalUsage': 2156,
                    'Price/Unit': 0.4355,
                },
                'SMS': {
                    'TotalCost': 1301
                    , 'TotalUsage': 3129
                    , 'Price/Unit': 0.4158
                },
                'Data': {
                    'TotalCost': 21741
                    , 'TotalUsage': 12102
                    , 'Price/Unit': 0.00175442
                },
                'Total': {
                    'TotalCost': 23981
                }
            },
            {
                'ID': 2,
                'Name': 'Australia',
                'ISO': 'AUS',
                'Voice': {
                    'TotalCost': 1689,
                    'TotalUsage': 1937,
                    'Price/Unit': 0.8722,
                },
                'SMS': {
                    'TotalCost': 213
                    , 'TotalUsage': 1292
                    , 'Price/Unit': 0.1647
                },
                'Data': {
                    'TotalCost': 14093
                    , 'TotalUsage': 6614
                    , 'Price/Unit': 0.00208069
                },
                'Total': {
                    'TotalCost': 15995
                }
            },

            {
                'ID': 3,
                'Name': 'Germany',
                'ISO': 'DEU',
                'Voice': {
                    'TotalCost': 617,
                    'TotalUsage': 2294,
                    'Price/Unit': 0.2689,
                },
                'SMS': {
                    'TotalCost': 2105
                    , 'TotalUsage': 2029
                    , 'Price/Unit': 1.0373
                },
                'Data': {
                    'TotalCost': 9017
                    , 'TotalUsage': 9169
                    , 'Price/Unit': 0.00096033
                },
                'Total': {
                    'TotalCost': 11738
                }
            }, {
                'ID': 4,
                'Name': 'United States',
                'ISO': 'USA',
                'Voice': {
                    'TotalCost': 3048,
                    'TotalUsage': 2096,
                    'Price/Unit': 1.4539,
                },
                'SMS': {
                    'TotalCost': 257
                    , 'TotalUsage': 3943
                    , 'Price/Unit': 0.0651
                },
                'Data': {
                    'TotalCost': 5773
                    , 'TotalUsage': 11741
                    , 'Price/Unit': 0.00048015

                },
                'Total': {
                    'TotalCost': 9078
                }
            },
            {
                'ID': 5,
                'Name': 'Brazil',
                'ISO': 'BRA',
                'Voice': {
                    'TotalCost': 5256,
                    'TotalUsage': 5368,
                    'Price/Unit': 0.9791,
                },
                'SMS': {
                    'TotalCost': 210
                    , 'TotalUsage': 602
                    , 'Price/Unit': 0.3484
                },
                'Data': {
                    'TotalCost': 972
                    , 'TotalUsage': 18134
                    , 'Price/Unit': 0.00005237

                },
                'Total': {
                    'TotalCost': 6438
                }
            }

        ];

        const ForcastedInbound = [
            {
                'ID': 1,
                'Name': 'Russia',
                'ISO': 'RUS',
                'Voice': {
                    'TotalCost': 2347,
                    'TotalUsage': 5314,
                    'Price/Unit': 0.4417,
                },
                'SMS': {
                    'TotalCost': 3253
                    , 'TotalUsage': 5323
                    , 'Price/Unit': 0.6111
                },
                'Data': {
                    'TotalCost': 54352
                    , 'TotalUsage': 35254
                    , 'Price/Unit': 0.001505592
                },
                'Total': {
                    'TotalCost': 59952
                }
            },
            {
                'ID': 2,
                'Name': 'United States',
                'ISO': 'USA',
                'Voice': {
                    'TotalCost': 4223,
                    'TotalUsage': 4342,
                    'Price/Unit': 0.0928,
                },
                'SMS': {
                    'TotalCost': 532
                    , 'TotalUsage': 5730
                    , 'Price/Unit': 0.1647
                },
                'Data': {
                    'TotalCost': 35232
                    , 'TotalUsage': 16836
                    , 'Price/Unit': 0.002043612
                },
                'Total': {
                    'TotalCost': 39987
                }
            },

            {
                'ID': 3,
                'Name': 'Australia',
                'ISO': 'AUS',
                'Voice': {
                    'TotalCost': 1542,
                    'TotalUsage': 8234,
                    'Price/Unit': 0.1873,
                },
                'SMS': {
                    'TotalCost': 5262
                    , 'TotalUsage': 5323
                    , 'Price/Unit': 0.9885
                },
                'Data': {
                    'TotalCost': 22542
                    , 'TotalUsage': 15423
                    , 'Price/Unit': 0.001427327
                },
                'Total': {
                    'TotalCost': 29346
                }
            }, {
                'ID': 4,
                'Name': 'Canada',
                'ISO': 'CAN',
                'Voice': {
                    'TotalCost': 5120,
                    'TotalUsage': 5241,
                    'Price/Unit': 0.9769,
                },
                'SMS': {
                    'TotalCost': 642
                    , 'TotalUsage': 7357
                    , 'Price/Unit': 0.0873
                },
                'Data': {
                    'TotalCost': 14432
                    , 'TotalUsage': 54353
                    , 'Price/Unit': 0.000259300
                },
                'Total': {
                    'TotalCost': 20194
                }
            }
            ,
            {
                'ID': 5,
                'Name': 'India',
                'ISO': 'IND',
                'Voice': {
                    'TotalCost': 15640,
                    'TotalUsage': 13420,
                    'Price/Unit': 1.1654,
                },
                'SMS': {
                    'TotalCost': 524
                    , 'TotalUsage': 754
                    , 'Price/Unit': 0.6950
                },
                'Data': {
                    'TotalCost': 2431
                    , 'TotalUsage': 47334
                    , 'Price/Unit': 0.000050155
                },
                'Total': {
                    'TotalCost': 18595
                }
            }
        ];

        const CurruntOutBoundSummury =
        {

            'Inbound': {
                'Voice': {
                    'TotalCost': 42259,
                    'TotalUsage': 166172,
                    'Price/Unit': 0.254306415727594,
                },
                'SMS': {
                    'TotalCost': 15367
                    , 'TotalUsage': 34764
                    , 'Price/Unit': 0.44203100087118
                },
                'Data': {
                    'TotalCost': 134459
                    , 'TotalUsage': 184973
                    , 'Price/Unit': 0.00070987479538
                },
                'Total': {
                    'TotalCost': 192085
                    , 'TotalUsage': 385909
                    , 'Price/Unit': 0.497745509639499
                }
            },

            'Outbound': {
                'Voice': {
                    'TotalCost': 141773,
                    'TotalUsage': 135430,
                    'Price/Unit': 1.0468,
                },
                'SMS': {
                    'TotalCost': 47258
                    , 'TotalUsage': 304520
                    , 'Price/Unit': 0.1552
                },
                'Data': {
                    'TotalCost': 283546
                    , 'TotalUsage': 730232
                    , 'Price/Unit': 0.0003791946
                },
                'Total': {
                    'TotalCost': 472576,
                    'TotalUsage': 1170182
                    , 'Price/Unit': 0.40384829027
                }
            }
        };

        const CurruntInboundSummury =
        {

            'Inbound': {
                'Voice': {
                    'TotalCost': 42259,
                    'TotalUsage': 166172,
                    'Price/Unit': 0.2543,
                },
                'SMS': {
                    'TotalCost': 15367
                    , 'TotalUsage': 34764
                    , 'Price/Unit': 0.4420
                },
                'Data': {
                    'TotalCost': 134459
                    , 'TotalUsage': 184973
                    , 'Price/Unit': 0.00070987

                },
                'Total': {
                    'TotalCost': 192085
                    , 'TotalUsage': 385909
                    , 'Price/Unit': 0.4977
                }
            },

            'Outbound': {
                'Voice': {
                    'TotalCost': 141773,
                    'TotalUsage': 135430,
                    'Price/Unit': 1.0468,
                },
                'SMS': {
                    'TotalCost': 47258
                    , 'TotalUsage': 304520
                    , 'Price/Unit': 0.1552
                },
                'Data': {
                    'TotalCost': 283546
                    , 'TotalUsage': 730232
                    , 'Price/Unit': 0.00037919
                },
                'Total': {
                    'TotalCost': 472576,
                    'TotalUsage': 1170182
                    , 'Price/Unit': 0.4038
                }
            }
        };

        const ForcastedInboundSummury = {

            'Inbound': {
                'Voice': {
                    'TotalCost': 105647,
                    'TotalUsage': 417430,
                    'Price/Unit': 0.2531,
                },
                'SMS': {
                    'TotalCost': 38417
                    , 'TotalUsage': 65798
                    , 'Price/Unit': 0.5839
                },
                'Data': {
                    'TotalCost': 336148
                    , 'TotalUsage': 519433
                    , 'Price/Unit': 0.000631977
                },
                'Total': {
                    'TotalCost': 480211
                    , 'TotalUsage': 1002661
                    , 'Price/Unit': 0.4789
                }
            },
            'Outbound': {
                'Voice': {
                    'TotalCost': 141773,
                    'TotalUsage': 328540,
                    'Price/Unit': 0.8730,
                },
                'SMS': {
                    'TotalCost': 95605
                    , 'TotalUsage': 488788
                    , 'Price/Unit': 0.1956
                },
                'Data': {
                    'TotalCost': 573629
                    , 'TotalUsage': 1973862
                    , 'Price/Unit': 0.000284
                },
                'Total': {
                    'TotalCost': 956048,
                    'TotalUsage': 2791190
                    , 'Price/Unit': 0.3425
                }
            }
        };

        const ForcastedOutboundSummury = {

            'Inbound': {
                'Voice': {
                    'TotalCost': 105647,
                    'TotalUsage': 417430,
                    'Price/Unit': 0.2531,
                },
                'SMS': {
                    'TotalCost': 38417
                    , 'TotalUsage': 65798
                    , 'Price/Unit': 0.5839
                },
                'Data': {
                    'TotalCost': 336148
                    , 'TotalUsage': 519433
                    , 'Price/Unit': 0.00063198
                },
                'Total': {
                    'TotalCost': 480211
                    , 'TotalUsage': 1002661
                    , 'Price/Unit': 0.4789369772749
                }
            },
            'Outbound': {
                'Voice': {
                    'TotalCost': 286814,
                    'TotalUsage': 328540,
                    'Price/Unit': 0.8730,
                },
                'SMS': {
                    'TotalCost': 95605
                    , 'TotalUsage': 488788
                    , 'Price/Unit': 0.1956
                },
                'Data': {
                    'TotalCost': 573629
                    , 'TotalUsage': 1973862
                    , 'Price/Unit': 0.00028380

                },
                'Total': {
                    'TotalCost': 956048,
                    'TotalUsage': 2791190
                    , 'Price/Unit': 0.3425
                }
            }
        };

        return {
            'Types': [{ ID: 1, Value: 'All' }],
            'Group': [],
            'Period': [{ ID: 1, Value: 'Forcasted' }],
            'DatePeriod': [new Date('01/01/2021'), new Date('12/31/2021')],
            'Direction': [{ ID: 1, Value: 'Inbound' }],
            'DealType': [{ ID: 4, Value: 'IOT Discount' }],
            'Deal': [{ ID: 1, Value: 'Completed deals' },
            { ID: 2, Value: 'Negotiations in progress' }],
            'CurruntOutbound': CurruntOutbound,
            'ForcastedOutbound': ForcastedOutbound,
            'CurruntInbound': CurruntInbound,
            'ForcastedInbound': ForcastedInbound,
            'CurruntOutBoundSummury': CurruntOutBoundSummury,
            'CurruntInboundSummury': CurruntInboundSummury,
            'ForcastedInboundSummury': ForcastedInboundSummury,
            'ForcastedOutboundSummury': ForcastedOutboundSummury
        };
    }
    // #endregion

    // __________________________________Screen2 Start_________________________________//
    // #region "AnalyseFast Screen2"
    isincludeThousandsSeparator = true;
    public inChartRendered = false;
    public outChartRendered = false;
    public balanceUnbalanceRowVariable = {
        TotalUnit: Number(0),
        BalancedUnits: Number(0),
        UnbalancedUnits: Number(0),
        BalancedUnit_Price: Number(0),
        BalancedRevenue: Number(0),
        TotalRevenueasperaveragerate: Number(0),
        UnbalancedRevenue: Number(0),
        UnbalancedUnit_Price: Number(0),
        TotalRevenue: Number(0)
    };
    public inBoundUnbalanceRow = null;
    public outBoundUnbalanceRow = null;

    public decimalMask100Limit = createNumberMask({
        prefix: '',
        postfix: '%',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 3,
        maxValue: 100,
        minValue: 0,
        allowNegative: true
    });
    public decimalMask9Limit = createNumberMask({
        prefix: '',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 4,
        integerLimit: 9,
        includeThousandsSeparator: this.isincludeThousandsSeparator,
        thousandsSeparatorSymbol: ','
        , allowNegative: true
    });
    public decimalMaskLimit = createNumberMask({
        prefix: '',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 4,
        integerLimit: 9,
        includeThousandsSeparator: this.isincludeThousandsSeparator,
        thousandsSeparatorSymbol: ',',
        allowNegative: true
    });
    public dropdownSettings = {
        singleSelection: true,
        idField: 'ID',
        textField: 'Value',
        itemsShowLimit: 1,
        allowSearchFilter: false,
        enableCheckAll: false
    };

    public NetPosition = [
        { ID: 2, Value: 'Net Outbound' },
        { ID: 1, Value: 'Net Inbound' }];

    public ScenarioList = [
        { ID: 3, Value: 'Draft Sc.1' },
        { ID: 4, Value: 'Draft Sc.2' }];

    public TotalSummery = [{
        'ID': 0,
        'Name': 'Total',
        'Voice': {
            'Unit': 71572590,
        },
        'SMS': {
            'Unit': 77968,
        },
        'Data': {
            'Unit': 685278661,
        },
        'Total': {
            'Unit': 756929219,
        }
    },];


    public FlateRateOutbound = {
        'ID': 3,
        'Name': 'Dummy Operator',
        'Voice': {
            'Unit': 6506599,
            'Price/Unit': 0.0500,
            'Revenue': 325330
        },
        'SMS': {
            'Unit': 7088,
            'Price/Unit': 0.0500,
            'Revenue': 354
        },
        'Data': {
            'Unit': 62298060,
            'Price/Unit': 0.0100,
            'Revenue': 498384
        },
        'Total': {
            'Unit': 68811747,
            'Price/Unit': 0.0100,
            'Revenue': 824069
        }
    };
    public FlateRateInbound = {
        'ID': 3,
        'Name': 'Dummy Operator',
        'Voice': {
            'Unit': 589558,
            'Price/Unit': 0.0500,
            'Revenue': 294779
        },
        'SMS': {
            'Unit': 74449,
            'Price/Unit': 0.0500,
            'Revenue': 3722
        },
        'Data': {
            'Unit': 73394276,
            'Price/Unit': 0.0080,
            'Revenue': 587154
        },
        'Total': {
            'Unit': 74058283,
            'Price/Unit': 0.0100,
            'Revenue': 885656
        }
    };

    public AYCEOutbound = {
        'ID': 2,
        'Name': 'Orange France',
        'Voice': {
            'Unit': 26026396,
            'Price/Unit': 0.0500,
            'Revenue': 1301320,
            'Contribution': 39.4785
        },
        'SMS': {
            'Unit': 28352,
            'Price/Unit': 0.0500,
            'Revenue': 1418,
            'Contribution': 0.0430
        },
        'Data': {
            'Unit': 249192240,
            'Price/Unit': 0.0100,
            'Revenue': 1993538,
            'Contribution': 60.4785
        },
        'Total': {
            'Unit': 275246989,
            'Price/Unit': 0.0100,
            'Revenue': 3296275,
            'Contribution': 100
        }
    };

    public AYCEInbound = {
        'ID': 2,
        'Name': 'Orange France',
        'Voice': {
            'Unit': 589793,
            'Price/Unit': 0.5000,
            'Revenue': 294897,
            'Contribution': 32.6473
        },
        'SMS': {
            'Unit': 65406,
            'Price/Unit': 0.0500,
            'Revenue': 3270,
            'Contribution': 0.3620
        },
        'Data': {
            'Unit': 75639193,
            'Price/Unit': 0.0080,
            'Revenue': 605114,
            'Contribution': 66.9907
        },
        'Total': {
            'Unit': 76294392,
            'Price/Unit': 0.0100,
            'Revenue': 903280,
            'Contribution': 100
        }
    };
    public BanlanceUnBanlanceOutbound = {
        'ID': 1,
        'Name': 'SFR',
        'Voice': {
            'Unit': 32532996,
            'Price/Unit': 0.0500,
            'Revenue': 325330
        },
        'SMS': {
            'Unit': 35440,
            'Price/Unit': 0.0500,
            'Revenue': 354
        },
        'Data': {
            'Unit': 311490301,
            'Price/Unit': 0.0100,
            'Revenue': 498384
        },
        'Total': {
            'Unit': 344058736,
            'Price/Unit': 0.0100,
            'Revenue': 824069
        }
    };
    public BanlanceUnBanlanceInbound = {
        'ID': 1,
        'Name': 'SFR',
        'Voice': {
            'Unit': 539188,
            'Price/Unit': 0.0500,
            'Revenue': 269594,
            'Contribution': 31
        },
        'SMS': {
            'Unit': 59017,
            'Price/Unit': 0.0500,
            'Revenue': 2951,
            'Contribution': 0.34
        },
        'Data': {
            'Unit': 72931183,
            'Price/Unit': 0.0080,
            'Revenue': 583449,
            'Contribution': 68
        },
        'Total': {
            'Unit': 73529388,
            'Price/Unit': 0.0100,
            'Revenue': 855994,
            'Contribution': 100
        }
    };
    public outBoundData = [
        {
            'ID': 0,
            'Name': 'Total',
            'Voice': {
                'Unit': 168000000,
                'Price/Unit': 0.0500,
                'Revenue': 8064000
            },
            'SMS': {
                'Unit': 30000000,
                'Price/Unit': 0.0500,
                'Revenue': 744000
            },
            'Data': {
                'Unit': 105000000,
                'Price/Unit': 0.0800,
                'Revenue': 8786400
            },
            'Total': {
                'Unit': 303000000,
                'Price/Unit': 0.0600,
                'Revenue': 17594400
            }
        },
        this.BanlanceUnBanlanceOutbound,
        this.FlateRateOutbound,
        this.AYCEOutbound
    ];
    public iNBoundData = [
        {
            'ID': 0,
            'Name': 'Total',
            'Voice': {
                'Unit': 168000000,
                'Price/Unit': 0.0500,
                'Revenue': 8064000
            },
            'SMS': {
                'Unit': 30000000,
                'Price/Unit': 0.0500,
                'Revenue': 744000
            },
            'Data': {
                'Unit': 105000000,
                'Price/Unit': 0.0100,
                'Revenue': 260400
            },
            'Total': {
                'Unit': 303000000,
                'Price/Unit': 0.0300,
                'Revenue': 9068400
            }
        },
        this.BanlanceUnBanlanceInbound,
        this.FlateRateInbound,
        this.AYCEInbound
    ];

    public OutBoundTotalRow = {
        TotalCurruntDiscountPeriodCost: Number(0),
        TotalForecastedcurrentperiod: Number(0),
        TotalCurrentOutboundtrafficsplit: Number(0),
        TotalUpdatedtrafficsplit: Number(0),
        TotalVoiceMo: Number(0),
        TotalSMS: Number(0),
        TotalData: Number(0),
        TotalCommitment: Number(0),
        TotalForecastedOutboundcost: Number(0),
        TotalVariance: Number(0),
    };
    public InBoundTotalRow = {
        TotalCurrentDiscountperiodrevenue: Number(0),
        TotalForecastedcurrentperiodrevenue: Number(0),
        TotalScaleoflastyearstraffic: Number(0),
        TotalVoiceMo: Number(0),
        TotalSMS: Number(0),
        TotalData: Number(0),
        TotalCommitment: Number(0),
        TotalForecastedOutboundcost: Number(0),
        TotalNewforecastedrevenue: Number(0),
        TotalVariance: Number(0),
    };
    public NetTotalRow = {
        ForecastedCurrentPeriodRevenue: Number(0),
        Forecastednetposition: Number(0),
        PerVariance: Number(0)
    };

    public InboundChart: any = [{
        ID: Number(0),
        Name: '',
        Commitment: Number(0),
        Newforecastedrevenue: Number(0)
    }];
    public OutboundChart: any = [{
        ID: Number(0),
        Name: '',
        Commitment: Number(0),
        ForecastedOutboundcost: Number(0)
    }];

    Screen2DataModel(Analysisscreen1?): any {
        const outBound = [
            {
                'ID': '1',
                'DealTypeID': '1',
                'OperatorName': 'SFR',
                'Group': 'Altice',
                'DealType': 'Bal / Unbal',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '1',
                'ScenarioName': 'New RFQ',
                'CurrentOutboundtrafficsplit': '75',
                'CurrentDiscountperiodcost': '20497086',
                'Forecastedcurrentperiod': '34161810',
                'Updatedtrafficsplit': '40',
                'Voice': '0.4902',
                'SMS': '0.0833',
                'Data': '0.0585',
                'Commitment': '6000000',
                'ForecastedOutboundcost': '20477784',
                'VarianceTypeID': '1',
                'Variance': '-13684026',
                'LastAnalysis': '29/06/2020 11: 00'

            },
            {
                'ID': '1',
                'DealTypeID': '1',
                'OperatorName': 'SFR',
                'Group': 'Altice',
                'DealType': 'Unbal',
                'Type': 'Child',
                'TypeID': '2',
                'ScenarioID': '1',
                'ScenarioName': 'New RFQ',
                'CurrentOutboundtrafficsplit': '',
                'CurrentDiscountperiodcost': '',
                'Forecastedcurrentperiod': '',
                'Updatedtrafficsplit': '',
                'Voice': '0.2500',
                'SMS': '0.0200',
                'Data': '0.0400',
                'Commitment': '6000000',
                'ForecastedOutboundcost': '20477784',
                'VarianceTypeID': '',
                'Variance': '-13684026',
                'LastAnalysis': ''


            },
            {
                'ID': '2',
                'DealTypeID': '2',
                'OperatorName': 'Orange France',
                'Group': 'Orange',
                'DealType': 'AYCE',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '2',
                'ScenarioName': 'Completed',
                'CurrentOutboundtrafficsplit': '15',
                'CurrentDiscountperiodcost': '1977765',
                'Forecastedcurrentperiod': '3296275',
                'Updatedtrafficsplit': '20',
                'Voice': '0.1324',
                'SMS': '0.1324',
                'Data': '0.0212',
                'Commitment': '4800000',
                'ForecastedOutboundcost': '4800000',
                'VarianceTypeID': '1',
                'Variance': '1503725',
                'LastAnalysis': '28/05/2020 10:43'


            },
            {
                'ID': '3',
                'DealTypeID': '3',
                'OperatorName': 'Dummy Operator',
                'Group': 'Dummy Group',
                'DealType': 'Flat Rate',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '3',
                'ScenarioName': 'Draft Sc.1',
                'CurrentOutboundtrafficsplit': '10',
                'CurrentDiscountperiodcost': '494441',
                'Forecastedcurrentperiod': '824069',
                'Updatedtrafficsplit': '40',
                'Voice': '0.1000',
                'SMS': '0.1000',
                'Data': '0.0050',
                'Commitment': '3000000',
                'ForecastedOutboundcost': '4236580',
                'VarianceTypeID': '1',
                'Variance': '3412511',
                'LastAnalysis': ''


            }
        ];
        const inBound = [
            {
                'ID': '1'
                , 'DealTypeID': '1'
                , 'OperatorName': 'SFR'
                , 'Group': 'Altice'
                , 'ScenarioName': 'New RFQ'
                , 'ScenarioID': '1'
                , 'DealType': 'Bal / Unbal'
                , 'Type': 'Parrent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '3718733'
                , 'Forecastedcurrentperiodrevenue': '4648416'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.4800'
                , 'SMS': '0.0470'
                , 'Data': '0.0590'
                , 'Commitment': '4000000'
                , 'Newforecastedrevenue': '6018519'
                , 'VarianceTypeID': '1'
                , 'Variance': '1370103'
            },

            {
                'ID': '1'
                , 'DealTypeID': '1'
                , 'OperatorName': 'SFR'
                , 'Group': 'Altice'
                , 'ScenarioName': 'New RFQ'
                , 'ScenarioID': '1'
                , 'DealType': 'Unbal'
                , 'Type': 'Child'
                , 'TypeID': '2'
                , 'CurrentDiscountperiodrevenue': '3718733'
                , 'Forecastedcurrentperiodrevenue': '4648416'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.4000'
                , 'SMS': '0.0390'
                , 'Data': '0.0480'
                , 'Commitment': '4000000'
                , 'Newforecastedrevenue': '6018519'
                , 'Variance': '1370103'
            },
            {
                'ID': '2'
                , 'DealTypeID': '2'
                , 'OperatorName': 'Orange France'
                , 'Group': 'Orange'
                , 'ScenarioName': 'Completed'
                , 'ScenarioID': '2'
                , 'DealType': 'AYCE'
                , 'Type': 'Parent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '541968'
                , 'Forecastedcurrentperiodrevenue': '903280'
                , 'Scaleoflastyearstraffic': '30'
                , 'Voice': '0.4258'
                , 'SMS': '0.0426'
                , 'Data': '0.0068'
                , 'Commitment': '1000000'
                , 'Newforecastedrevenue': '1000000'
                , 'VarianceTypeID': '1'
                , 'Variance': '96720'

            },
            {
                'ID': '3'
                , 'DealTypeID': '3'
                , 'OperatorName': 'Dummy Operator'
                , 'Group': 'Dummy Group'
                , 'ScenarioName': 'Draft Sc.1'
                , 'ScenarioID': '3'
                , 'DealType': 'Flat Rate'
                , 'Type': 'Parent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '552800'
                , 'Forecastedcurrentperiodrevenue': '947657'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.1000'
                , 'SMS': '0.0400'
                , 'Data': '0.0190'
                , 'Commitment': '2000000',
                'Newforecastedrevenue': '1747710'
                , 'VarianceTypeID': '1'
                , 'Variance': '800053'

            }];
        const net = [
            {
                'ID': '1',
                'OperatorName': 'SFR', 'Group': 'Altice',
                'DealType': 'Bal / Unbal',
                'DealTypeID': '1',
                'Forecastednetposition': '-17220076',
                'ForecastedCurrentPeriodRevenue': '12293319',
                'PerVariance': '-171',
                'IsEdit': false
            },
            {
                'ID': '2',
                'OperatorName': 'Orange France', 'Group': 'Orange',
                'DealType': 'AYCE',
                'DealTypeID': '2',
                'Forecastednetposition': '-3800000',
                'ForecastedCurrentPeriodRevenue': '-1407005',
                'PerVariance': '-63',
                'IsEdit': false
            },
            {
                'ID': '3',
                'OperatorName': 'Dummy Operator', 'Group': 'Dummy Group', 'DealType': 'Flat Rate',
                'DealTypeID': '3',
                'Forecastednetposition': '-2488870',
                'ForecastedCurrentPeriodRevenue': ' -2612458',
                'PerVariance': '5',
                'IsEdit': true
            }];
        return {
            'rangePicker': [new Date('01/01/2021'), new Date('12/31/2021')],
            'iVariance': [
                { 'ID': 1, 'Value': 'Budget' }
            ],
            'oVariance': [
                { 'ID': 1, 'Value': 'Budget' }
            ],
            'Country': Analysisscreen1 ? this.countryData.filter(x => x.id === Analysisscreen1.RegionName[0].ID).map(
                x => { return { 'ID': x.id, 'Value': x.name } }) : [this.countryData[0]].map(
                    x => { return { 'ID': x.id, 'Value': x.name } }),
            'NetPosition': Analysisscreen1 ? this.NetPosition.filter(x => x.ID === Analysisscreen1.Direction[0].ID) : [this.NetPosition[0]],
            'OutBound': outBound,
            'InBound': inBound,
            'Net': net
        };
    }

    Screen2DataModel_1(Analysisscreen1?): any {
        const outBound = [
            {
                'ID': '1',
                'DealTypeID': '1',
                'OperatorName': 'SFR',
                'Group': 'Altice',
                'DealType': 'Bal / Unbal',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '1',
                'ScenarioName': 'New RFQ',
                'CurrentOutboundtrafficsplit': '75',
                'CurrentDiscountperiodcost': '20497086',
                'Forecastedcurrentperiod': '34161810',
                'Updatedtrafficsplit': '40',
                'Voice': '0.5000',
                'SMS': '0.0900',
                'Data': '0.0650',
                'Commitment': '6000000',
                'ForecastedOutboundcost': '20477784',
                'VarianceTypeID': '1',
                'Variance': '-13684026',
                'LastAnalysis': '29/06/2020 11: 00'

            },
            {
                'ID': '1',
                'DealTypeID': '1',
                'OperatorName': 'SFR',
                'Group': 'Altice',
                'DealType': 'Unbal',
                'Type': 'Child',
                'TypeID': '2',
                'ScenarioID': '1',
                'ScenarioName': 'New RFQ',
                'CurrentOutboundtrafficsplit': '',
                'CurrentDiscountperiodcost': '',
                'Forecastedcurrentperiod': '',
                'Updatedtrafficsplit': '',
                'Voice': '0.2500',
                'SMS': '0.0200',
                'Data': '0.0400',
                'Commitment': '6000000',
                'ForecastedOutboundcost': '20477784',
                'VarianceTypeID': '',
                'Variance': '-13684026',
                'LastAnalysis': ''


            },
            {
                'ID': '2',
                'DealTypeID': '2',
                'OperatorName': 'Orange France',
                'Group': 'Orange',
                'DealType': 'AYCE',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '2',
                'ScenarioName': 'Completed',
                'CurrentOutboundtrafficsplit': '15',
                'CurrentDiscountperiodcost': '1977765',
                'Forecastedcurrentperiod': '3296275',
                'Updatedtrafficsplit': '20',
                'Voice': '0.1324',
                'SMS': '0.1324',
                'Data': '0.0212',
                'Commitment': '4800000',
                'ForecastedOutboundcost': '4800000',
                'VarianceTypeID': '1',
                'Variance': '1503725',
                'LastAnalysis': '28/05/2020 10:43'


            },
            {
                'ID': '3',
                'DealTypeID': '3',
                'OperatorName': 'Dummy Operator',
                'Group': 'Dummy Group',
                'DealType': 'Flat Rate',
                'Type': 'Parent',
                'TypeID': '1',
                'ScenarioID': '3',
                'ScenarioName': 'Draft Sc.1',
                'CurrentOutboundtrafficsplit': '10',
                'CurrentDiscountperiodcost': '494441',
                'Forecastedcurrentperiod': '824069',
                'Updatedtrafficsplit': '40',
                'Voice': '0.1000',
                'SMS': '0.1000',
                'Data': '0.0050',
                'Commitment': '3000000',
                'ForecastedOutboundcost': '4236580',
                'VarianceTypeID': '1',
                'Variance': '3412511',
                'LastAnalysis': ''


            }
        ];
        const inBound = [
            {
                'ID': '1'
                , 'DealTypeID': '1'
                , 'OperatorName': 'SFR'
                , 'Group': 'Altice'
                , 'ScenarioName': 'New RFQ'
                , 'ScenarioID': '1'
                , 'DealType': 'Bal / Unbal'
                , 'Type': 'Parrent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '3718733'
                , 'Forecastedcurrentperiodrevenue': '4648416'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.5000'
                , 'SMS': '0.0900'
                , 'Data': '0.0650'
                , 'Commitment': '4000000'
                , 'Newforecastedrevenue': '6018519'
                , 'VarianceTypeID': '1'
                , 'Variance': '1370103'
            },

            {
                'ID': '1'
                , 'DealTypeID': '1'
                , 'OperatorName': 'SFR'
                , 'Group': 'Altice'
                , 'ScenarioName': 'New RFQ'
                , 'ScenarioID': '1'
                , 'DealType': 'Unbal'
                , 'Type': 'Child'
                , 'TypeID': '2'
                , 'CurrentDiscountperiodrevenue': '3718733'
                , 'Forecastedcurrentperiodrevenue': '4648416'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.4000'
                , 'SMS': '0.0390'
                , 'Data': '0.0480'
                , 'Commitment': '4000000'
                , 'Newforecastedrevenue': '6018519'
                , 'Variance': '1370103'
            },
            {
                'ID': '2'
                , 'DealTypeID': '2'
                , 'OperatorName': 'Orange France'
                , 'Group': 'Orange'
                , 'ScenarioName': 'Completed'
                , 'ScenarioID': '2'
                , 'DealType': 'AYCE'
                , 'Type': 'Parent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '541968'
                , 'Forecastedcurrentperiodrevenue': '903280'
                , 'Scaleoflastyearstraffic': '30'
                , 'Voice': '0.4258'
                , 'SMS': '0.0426'
                , 'Data': '0.0068'
                , 'Commitment': '1000000'
                , 'Newforecastedrevenue': '1000000'
                , 'VarianceTypeID': '1'
                , 'Variance': '96720'

            },
            {
                'ID': '3'
                , 'DealTypeID': '3'
                , 'OperatorName': 'Dummy Operator'
                , 'Group': 'Dummy Group'
                , 'ScenarioName': 'Draft Sc.1'
                , 'ScenarioID': '3'
                , 'DealType': 'Flat Rate'
                , 'Type': 'Parent'
                , 'TypeID': '1'
                , 'CurrentDiscountperiodrevenue': '552800'
                , 'Forecastedcurrentperiodrevenue': '947657'
                , 'Scaleoflastyearstraffic': '20'
                , 'Voice': '0.1000'
                , 'SMS': '0.0400'
                , 'Data': '0.0190'
                , 'Commitment': '2000000',
                'Newforecastedrevenue': '1747710'
                , 'VarianceTypeID': '1'
                , 'Variance': '800053'

            }];
        const net = [
            {
                'ID': '1',
                'OperatorName': 'SFR', 'Group': 'Altice',
                'DealType': 'Bal / Unbal',
                'DealTypeID': '1',
                'Forecastednetposition': '-17220076',
                'ForecastedCurrentPeriodRevenue': '12293319',
                'PerVariance': '-171',
                'IsEdit': false
            },
            {
                'ID': '2',
                'OperatorName': 'Orange France', 'Group': 'Orange',
                'DealType': 'AYCE',
                'DealTypeID': '2',
                'Forecastednetposition': '-3800000',
                'ForecastedCurrentPeriodRevenue': '-1407005',
                'PerVariance': '-63',
                'IsEdit': false
            },
            {
                'ID': '3',
                'OperatorName': 'Dummy Operator', 'Group': 'Dummy Group', 'DealType': 'Flat Rate',
                'DealTypeID': '3',
                'Forecastednetposition': '-2488870',
                'ForecastedCurrentPeriodRevenue': ' -2612458',
                'PerVariance': '5',
                'IsEdit': true
            }];
        return {
            'rangePicker': [new Date('01/01/2021'), new Date('12/31/2021')],
            'iVariance': [
                { 'ID': 1, 'Value': 'Budget' }
            ],
            'oVariance': [
                { 'ID': 1, 'Value': 'Budget' }
            ],
            'Country': Analysisscreen1 ? this.countryData.filter(x => x.id === Analysisscreen1.RegionName[0].ID).map(
                x => { return { 'ID': x.id, 'Value': x.name } }) : [this.countryData[0]].map(
                    x => { return { 'ID': x.id, 'Value': x.name } }),
            'NetPosition': Analysisscreen1 ? this.NetPosition.filter(x => x.ID === Analysisscreen1.Direction[0].ID) : [this.NetPosition[0]],
            'OutBound': outBound,
            'InBound': inBound,
            'Net': net
        };
    }

    bindOutBuond(items?): FormArray {
        if (items) {
            const outBoundArray = new FormArray([]);
            items.forEach(element => {
                outBoundArray.push(new FormGroup({
                    'ID': new FormControl({ value: element.ID, disabled: false }),
                    'OperatorName': new FormControl({ value: element.OperatorName, disabled: false }),
                    'Group': new FormControl({ value: element.Group, disabled: false }),
                    'DealType': new FormControl({ value: element.DealType, disabled: false }),
                    'DealTypeID': new FormControl({ value: element.DealTypeID, disabled: false }),
                    'Type': new FormControl({ value: element.Type, disabled: false }),
                    'TypeID': new FormControl({ value: element.TypeID, disabled: false }),
                    'ScenarioName': new FormControl({ value: element.ScenarioName, disabled: false }),
                    'ScenarioID': new FormControl({ value: element.ScenarioID, disabled: false }),
                    'CurrentOutboundtrafficsplit': new FormControl({ value: element.CurrentOutboundtrafficsplit, disabled: false }),
                    'CurrentDiscountperiodcost': new FormControl({ value: element.CurrentDiscountperiodcost, disabled: false }),
                    'Forecastedcurrentperiod': new FormControl({ value: element.Forecastedcurrentperiod, disabled: false }),
                    'Updatedtrafficsplit': new FormControl({ value: element.Updatedtrafficsplit, disabled: false }),
                    'ForecastedOutboundcost': new FormControl({ value: element.ForecastedOutboundcost, disabled: false }),
                    'Voice': new FormControl({ value: element.Voice, disabled: false }),
                    'SMS': new FormControl({ value: element.SMS, disabled: false }),
                    'Data': new FormControl({ value: element.Data, disabled: false }),
                    'Commitment': new FormControl({ value: element.Commitment, disabled: false }),
                    'LastAnalysis': new FormControl({ value: element.LastAnalysis, disabled: false }),
                    'VarianceTypeID': new FormControl({ value: element.VarianceTypeID, disabled: false }),
                    'Variance': new FormControl({ value: element.Variance, disabled: false })
                }));
            });
            return outBoundArray;
        } else {
            return new FormArray([]);
        }
    }

    bindInBound(items?): FormArray {
        if (items) {
            const inBoundArray = new FormArray([]);
            items.forEach(element => {
                inBoundArray.push(new FormGroup({
                    'ID': new FormControl({ value: element.ID, disabled: false }),
                    'OperatorName': new FormControl({ value: element.OperatorName, disabled: false }),
                    'Group': new FormControl({ value: element.Group, disabled: false }),
                    'ScenarioName': new FormControl({ value: element.ScenarioName, disabled: false }),
                    'ScenarioID': new FormControl({ value: element.ScenarioID, disabled: false }),
                    'DealType': new FormControl({ value: element.DealType, disabled: false }),
                    'DealTypeID': new FormControl({ value: element.DealTypeID, disabled: false }),
                    'Type': new FormControl({ value: element.Type, disabled: false }),
                    'TypeID': new FormControl({ value: element.TypeID, disabled: false }),
                    'CurrentDiscountperiodrevenue': new FormControl({ value: element.CurrentDiscountperiodrevenue, disabled: false }),
                    'Scaleoflastyearstraffic': new FormControl({ value: element.Scaleoflastyearstraffic, disabled: false }),
                    'Newforecastedrevenue': new FormControl({ value: element.Newforecastedrevenue, disabled: false }),
                    'Voice': new FormControl({ value: element.Voice, disabled: false }),
                    'SMS': new FormControl({ value: element.SMS, disabled: false }),
                    'Data': new FormControl({ value: element.Data, disabled: false }),
                    'Forecastedcurrentperiodrevenue': new FormControl({ value: element.Forecastedcurrentperiodrevenue, disabled: false }),
                    'Commitment': new FormControl({ value: element.Commitment, disabled: false }),
                    'VarianceTypeID': new FormControl({ value: element.VarianceTypeID, disabled: false }),
                    'Variance': new FormControl({ value: element.Variance, disabled: false }),
                }));
            });
            return inBoundArray;
        } else {
            return new FormArray([]);
        }

    }


    bindNet(items?): FormArray {
        if (items) {
            const inBoundArray = new FormArray([]);
            items.forEach(element => {
                inBoundArray.push(new FormGroup({
                    'ID': new FormControl({ value: element.ID, disabled: false }),
                    'OperatorName': new FormControl({ value: element.OperatorName, disabled: false }),
                    'Group': new FormControl({ value: element.Group, disabled: false }),
                    'DealType': new FormControl({ value: element.DealType, disabled: false }),
                    'DealTypeID': new FormControl({ value: element.DealTypeID, disabled: false }),
                    'Forecastednetposition': new FormControl({ value: element.Forecastednetposition, disabled: false }),
                    'ForecastedCurrentPeriodRevenue': new FormControl({ value: element.ForecastedCurrentPeriodRevenue, disabled: false }),
                    'PerVariance': new FormControl({ value: element.PerVariance, disabled: false }),
                    'IsEdit': new FormControl({ value: element.IsEdit, disabled: false }),
                }));
            });
            return inBoundArray;
        } else {
            return new FormArray([]);
        }

    }

    getArray(control, form): FormArray {
        return form.get(control) as FormArray;
    }

    bindTotal(newScreen2Form, am4charts?, am4core?, outChart?, inChart?, isDefault = true, ischange = true, Type = 'OutBound', isPageLoad = false) {
        const OutBound = this.getArray('OutBound', newScreen2Form);
        const InBound = this.getArray('InBound', newScreen2Form);
        const TotalSplit = lodash.sum(OutBound.value.map(x => Number(x.Updatedtrafficsplit)));
        this.TotalUpdatedtrafficsplit = TotalSplit;
        if (TotalSplit === 100) {
            this.OutBoundTotalRow = {
                TotalCurruntDiscountPeriodCost: Number(0),
                TotalForecastedcurrentperiod: Number(0),
                TotalCurrentOutboundtrafficsplit: Number(0),
                TotalUpdatedtrafficsplit: Number(0),
                TotalVoiceMo: Number(0),
                TotalSMS: Number(0),
                TotalData: Number(0),
                TotalCommitment: Number(0),
                TotalForecastedOutboundcost: Number(0),
                TotalVariance: Number(0),
            };
            this.InBoundTotalRow = {
                TotalCurrentDiscountperiodrevenue: Number(0),
                TotalForecastedcurrentperiodrevenue: Number(0),
                TotalScaleoflastyearstraffic: Number(0),
                TotalVoiceMo: Number(0),
                TotalSMS: Number(0),
                TotalData: Number(0),
                TotalCommitment: Number(0),
                TotalForecastedOutboundcost: Number(0),
                TotalNewforecastedrevenue: Number(0),
                TotalVariance: Number(0),
            };
            this.NetTotalRow = {
                ForecastedCurrentPeriodRevenue: Number(0),
                Forecastednetposition: Number(0),
                PerVariance: Number(0)
            };
            this.isincludeThousandsSeparator = false;
            this.InboundChart = [];
            this.OutboundChart = [];
            const Net = [];

            if (Type == 'OutBound') {
                //Calculate outbound Total
                OutBound.controls.forEach(x => {
                    const ID = Number(x.get('ID').value);
                    const DealTypeID = Number(x.get('DealTypeID').value);
                    if (Number(x.get('TypeID').value) === 1) {
                        switch (DealTypeID) {
                            case 1://Bal/Unbal
                                this.CalculateBalUnbalceOutbound(x, ID, newScreen2Form, isDefault, ischange, isPageLoad);
                                break;
                            case 2://AYCE
                                this.CalculateAYCEOutbound(x, ID);
                                break;
                            case 3://Flat Rate
                                this.CalculateFlateRateOutbound(x, ID);
                                break;
                            default://
                                break;
                        }
                    }
                });
                //Calculate Inbound Total
                InBound.controls.forEach(x => {
                    const ID = Number(x.get('ID').value);
                    const DealTypeID = Number(x.get('DealTypeID').value);
                    if (Number(x.get('TypeID').value) === 1) {
                        switch (DealTypeID) {
                            case 1://Bal/Unbal
                                this.CalculateBalUnbalceInbound(x, ID, newScreen2Form, isDefault, ischange, isPageLoad);
                                break;
                            case 2://AYCE
                                this.CalculateAYCEInbound(x, ID);
                                break;
                            case 3://Flat Rate
                                this.CalculateFlateRateInbound(x, ID);
                                break;
                            default://
                                break;
                        }
                    }
                });
            } else {
                InBound.controls.forEach(x => {
                    const ID = Number(x.get('ID').value);
                    const DealTypeID = Number(x.get('DealTypeID').value);
                    if (Number(x.get('TypeID').value) === 1) {
                        switch (DealTypeID) {
                            case 1://Bal/Unbal
                                this.CalculateBalUnbalceInbound(x, ID, newScreen2Form, isDefault, ischange, isPageLoad);
                                break;
                            case 2://AYCE
                                this.CalculateAYCEInbound(x, ID);
                                break;
                            case 3://Flat Rate
                                this.CalculateFlateRateInbound(x, ID);
                                break;
                            default://
                                break;
                        }
                    }
                });
                OutBound.controls.forEach(x => {
                    const ID = Number(x.get('ID').value);
                    const DealTypeID = Number(x.get('DealTypeID').value);
                    if (Number(x.get('TypeID').value) === 1) {
                        switch (DealTypeID) {
                            case 1://Bal/Unbal
                                this.CalculateBalUnbalceOutbound(x, ID, newScreen2Form, isDefault, ischange, isPageLoad);
                                break;
                            case 2://AYCE
                                this.CalculateAYCEOutbound(x, ID);
                                break;
                            case 3://Flat Rate
                                this.CalculateFlateRateOutbound(x, ID);
                                break;
                            default://
                                break;
                        }
                    }
                });
                //Calculate Inbound Total
            }
            const InBoundValue = InBound.value;
            const OutBoundValue = OutBound.value;
            const NetControl = this.getArray('Net', newScreen2Form);
            for (let i = 0; i < InBound.length; i++) {
                if (Number(OutBoundValue[i].TypeID) === 1 && Number(InBoundValue[i].TypeID) === 1) {
                    let Scenarioforecastednetposition = 0;


                    const OutboundCommitment = Number(OutBoundValue[i].Commitment ? parseInt(OutBoundValue[i].Commitment.replace(/,/g, '')) : 0);
                    const InboundCommitment = Number(InBoundValue[i].Commitment ? parseInt(InBoundValue[i].Commitment.replace(/,/g, '')) : 0);

                    const OutBoundLogic = OutBoundValue[i].ForecastedOutboundcost >= OutboundCommitment;
                    const InBoundLogic = InBoundValue[i].Newforecastedrevenue >= InboundCommitment;

                    if (OutBoundLogic && InBoundLogic) {
                        Scenarioforecastednetposition = Number(InBoundValue[i].Newforecastedrevenue) - Number(OutBoundValue[i].ForecastedOutboundcost);
                    } else if (!OutBoundLogic && InBoundLogic) {
                        Scenarioforecastednetposition = Number(InBoundValue[i].Newforecastedrevenue) - Number(OutboundCommitment);
                    } else if (OutBoundLogic && !InBoundLogic) {
                        Scenarioforecastednetposition = Number(InboundCommitment) - Number(OutBoundValue[i].ForecastedOutboundcost);
                    } else if (!OutBoundLogic && !InBoundLogic) {
                        Scenarioforecastednetposition = Number(InboundCommitment) - Number(OutboundCommitment);
                    }

                    let iBudReve = 0;
                    let oBudReve = 0;
                    let NetCountryBudget = 0;
                    if (Number(InBoundValue[i].VarianceTypeID) == 1) {//Budget 
                        iBudReve = Number(InBoundValue[i].Forecastedcurrentperiodrevenue);
                    } else {//baseline
                        iBudReve = Number(InBoundValue[i].CurrentDiscountperiodrevenue)
                    }

                    if (Number(OutBoundValue[i].VarianceTypeID == 1)) {//Budget 
                        oBudReve = Number(OutBoundValue[i].Forecastedcurrentperiod);
                    } else {//baseline
                        oBudReve = Number(OutBoundValue[i].CurrentDiscountperiodcost);
                    }



                    const CalculateVariance = iBudReve - oBudReve;

                    const Variance = Scenarioforecastednetposition - CalculateVariance;

                    const PerVariance = (Scenarioforecastednetposition / CalculateVariance - 1) * 100;

                    if (Number(InBoundValue[i].VarianceTypeID) == 1 && Number(OutBoundValue[i].VarianceTypeID == 1)) {
                        NetCountryBudget = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue - this.OutBoundTotalRow.TotalForecastedcurrentperiod;
                    } else {
                        NetCountryBudget = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue - this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost;
                    }

                    this.NetTotalRow.Forecastednetposition = this.NetTotalRow.Forecastednetposition + Variance;
                    this.NetTotalRow.ForecastedCurrentPeriodRevenue = this.NetTotalRow.ForecastedCurrentPeriodRevenue + Scenarioforecastednetposition;
                    //  this.NetTotalRow.PerVariance = this.NetTotalRow.PerVariance + PerVariance;
                    //this.NetTotalRow.PerVariance = (this.NetTotalRow.Forecastednetposition / this.NetTotalRow.ForecastedCurrentPeriodRevenue - 1) * 100;
                    this.NetTotalRow.PerVariance = (NetCountryBudget / this.NetTotalRow.ForecastedCurrentPeriodRevenue - 1) * 100;
                    Net.push({
                        'ID': OutBoundValue[i].ID,
                        'OperatorName': OutBoundValue[i].OperatorName,
                        'Group': OutBoundValue[i].Group,
                        'DealType': OutBoundValue[i].DealType,
                        'ForecastedCurrentPeriodRevenue': Scenarioforecastednetposition,
                        'Forecastednetposition': Variance,
                        'PerVariance': Math.round(PerVariance),
                        'IsEdit': (OutBoundValue[i].OperatorName === 'Dummy Operator') ? true : false
                    });
                }
            }

            NetControl.controls = [];
            this.bindNet((Net) ? Net : []).controls.forEach((element) => {
                NetControl.push(element);
            });
            this.isincludeThousandsSeparator = true;
            // this.createGuageChart(am4charts, am4core, outChart, inChart);
            if (am4charts) {
                this.createXYChart(am4charts, am4core, outChart, inChart);
            }
        } else {
            this.snackBar.open('Sum of updated traffic split must be 100%', '', {
                duration: 4000, horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });
        }
        return newScreen2Form;
    }

    CalculateFlateRateOutbound(x: any, ID) {
        const CurruntDiscountPeriodCost = Number(x.get('CurrentDiscountperiodcost').value);
        const Forecastedcurrentperiod = Number(x.get('Forecastedcurrentperiod').value);
        // const Commitment = Number(x.get('Commitment').value);
        const Commitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        const Updatedtrafficsplit = Number(x.get('Updatedtrafficsplit').value);
        const Voice = Number(x.get('Voice').value);
        const SMS = Number(x.get('SMS').value);
        const Data = Number(x.get('Data').value);

        const filterData: any = this.outBoundData.filter(y => y.ID === ID);
        const OutBound = (filterData && filterData.length > 0) ? filterData[0] : [];

        const filtersummeryData: any = this.TotalSummery.filter(y => y.ID === 0);
        const OutBoundTotal = (filtersummeryData && filtersummeryData.length > 0) ? filtersummeryData[0] : [];

        OutBound.Total.Revenue = OutBound.Voice.Revenue + OutBound.SMS.Revenue + OutBound.Data.Revenue;


        const VoiceUnits = (OutBoundTotal.Voice.Unit * Updatedtrafficsplit) / 100;
        OutBound.Voice.Contribution = (OutBound.Voice.Revenue * 100) / OutBound.Total.Revenue;
        const VoiceUnit_Price = Voice;
        const VoiceRevenew = VoiceUnits * VoiceUnit_Price;

        const SMSUnits = (OutBoundTotal.SMS.Unit * Updatedtrafficsplit) / 100;
        OutBound.SMS.Contribution = (OutBound.SMS.Revenue * 100) / OutBound.Total.Revenue;
        const SMSUnit_Price = SMS;
        const SMSRevenew = SMSUnits * SMSUnit_Price;

        const DataUnits = (OutBoundTotal.Data.Unit * Updatedtrafficsplit) / 100;
        OutBound.Data.Contribution = (OutBound.Data.Revenue * 100) / OutBound.Total.Revenue;
        const DataUnit_Price = Data;
        const DataRevenew = DataUnits * DataUnit_Price;

        const TotalUnits = VoiceUnits + SMSUnits + DataUnits;
        const TotalRevenew = VoiceRevenew + SMSRevenew + DataRevenew;
        const TotalUnit_Price = TotalRevenew / TotalUnits;

        //const ForecastedOutboundcost = (TotalRevenew) / 7 * 12;
        const ForecastedOutboundcost = TotalRevenew;
        x.get('ForecastedOutboundcost').patchValue(Math.ceil(ForecastedOutboundcost));

        let Cost = 0;
        switch (Number(x.get('VarianceTypeID').value)) {
            case 1:
                //Budget Cost
                //Forecastedcurrentperiod
                Cost = Number(x.get('Forecastedcurrentperiod').value);
                break;
            case 2:
                // Baseline Cost
                //CurrentDiscountperiodcost
                Cost = Number(x.get('CurrentDiscountperiodcost').value);
                break;
        }
        const Variance = Math.ceil(ForecastedOutboundcost) - Cost;
        x.get('Variance').patchValue(Variance);

        this.varianceOutbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
        this.OutboundChart.push({
            ID: ID,
            Name: x.get('OperatorName').value,
            Commitment: Commitment,
            ForecastedOutboundcost: Math.ceil(ForecastedOutboundcost),
            Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiod').value : x.get('CurrentDiscountperiodcost').value
        });

        this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost = this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost +
            CurruntDiscountPeriodCost;
        this.OutBoundTotalRow.TotalForecastedcurrentperiod = this.OutBoundTotalRow.TotalForecastedcurrentperiod +
            Forecastedcurrentperiod;
        this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit = this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit +
            Number(x.get('CurrentOutboundtrafficsplit').value);
        this.OutBoundTotalRow.TotalUpdatedtrafficsplit = this.OutBoundTotalRow.TotalUpdatedtrafficsplit + Number(x.get('Updatedtrafficsplit').value);
        this.OutBoundTotalRow.TotalVoiceMo = this.OutBoundTotalRow.TotalVoiceMo +
            (Updatedtrafficsplit * Voice) / 100;
        this.OutBoundTotalRow.TotalSMS = this.OutBoundTotalRow.TotalSMS +
            (Updatedtrafficsplit * SMS) / 100;
        this.OutBoundTotalRow.TotalData = this.OutBoundTotalRow.TotalData +
            (Updatedtrafficsplit * Data) / 100;
        this.OutBoundTotalRow.TotalCommitment = this.OutBoundTotalRow.TotalCommitment + Commitment;
        this.OutBoundTotalRow.TotalForecastedOutboundcost = this.OutBoundTotalRow.TotalForecastedOutboundcost +
            Math.ceil(ForecastedOutboundcost);

        this.OutBoundTotalRow.TotalVariance = this.OutBoundTotalRow.TotalVariance +
            Math.ceil(Variance);
    }

    CalculateFlateRateInbound(x: any, ID) {
        const filterData: any = this.iNBoundData.filter(y => y.ID === ID);
        const InBound = (filterData && filterData.length > 0) ? filterData[0] : [];
        const Scaleoflastyearstraffic = Number(x.get('Scaleoflastyearstraffic').value);

        const CurrentDiscountperiodrevenue = Number(x.get('CurrentDiscountperiodrevenue').value);
        const Forecastedcurrentperiodrevenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
        // const Commitment = Number(x.get('Commitment').value);
        const Commitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        const Voice = Number(x.get('Voice').value);
        const SMS = Number(x.get('SMS').value);
        const Data = Number(x.get('Data').value);

        const VoiceUnits = (InBound.Voice.Unit * (1 + Scaleoflastyearstraffic / 100));
        const VoiceUnit_Price = Voice;
        const VoiceRevenew = VoiceUnits * VoiceUnit_Price;

        const SMSUnits = (InBound.SMS.Unit * (1 + Scaleoflastyearstraffic / 100));
        const SMSUnit_Price = SMS;
        const SMSRevenew = SMSUnits * SMSUnit_Price;

        const DataUnits = (InBound.Data.Unit * (1 + Scaleoflastyearstraffic / 100));
        const DataUnit_Price = Data;
        const DataRevenew = DataUnits * DataUnit_Price;

        const TotalUnits = VoiceUnits + SMSUnits + DataUnits;
        const TotalRevenew = VoiceRevenew + SMSRevenew + DataRevenew;
        const TotalUnit_Price = TotalRevenew / TotalUnits;

        //const Newforecastedrevenue = (TotalRevenew) / 7 * 12;
        const Newforecastedrevenue = TotalRevenew;
        x.get('Newforecastedrevenue').patchValue(Math.ceil(Newforecastedrevenue));

        let Revenue = 0;
        switch (Number(x.get('VarianceTypeID').value)) {
            case 1:
                //Budget Revenue
                //Forecastedcurrentperiodrevenue
                Revenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
                break;
            case 2:
                // Baseline Revenue
                //CurrentDiscountperiodrevenue
                Revenue = Number(x.get('CurrentDiscountperiodrevenue').value);
                break;
        }
        const Variance = Math.ceil(Newforecastedrevenue) - Revenue;
        x.get('Variance').patchValue(Variance);

        this.varianceInbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
        this.InboundChart.push({
            ID: ID,
            Name: x.get('OperatorName').value,
            Commitment: Commitment,
            Newforecastedrevenue: Math.ceil(Newforecastedrevenue),
            Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiodrevenue').value : x.get('CurrentDiscountperiodrevenue').value
        });

        this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue +
            CurrentDiscountperiodrevenue;
        this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue +
            Forecastedcurrentperiodrevenue;
        this.InBoundTotalRow.TotalScaleoflastyearstraffic = this.InBoundTotalRow.TotalScaleoflastyearstraffic + Number(x.get('Scaleoflastyearstraffic').value);
        this.InBoundTotalRow.TotalVoiceMo = this.InBoundTotalRow.TotalVoiceMo +
            (Scaleoflastyearstraffic * Voice) / 100;
        this.InBoundTotalRow.TotalSMS = this.InBoundTotalRow.TotalSMS +
            (Scaleoflastyearstraffic * SMS) / 100;
        this.InBoundTotalRow.TotalData = this.InBoundTotalRow.TotalData +
            (Scaleoflastyearstraffic * Data) / 100;
        this.InBoundTotalRow.TotalCommitment = this.InBoundTotalRow.TotalCommitment + Commitment;
        this.InBoundTotalRow.TotalNewforecastedrevenue = this.InBoundTotalRow.TotalNewforecastedrevenue +
            Math.ceil(Newforecastedrevenue);
        this.InBoundTotalRow.TotalVariance = this.InBoundTotalRow.TotalVariance +
            Math.ceil(Variance);
    }

    CalculateAYCEOutbound(x: any, ID) {
        const filterData: any = this.outBoundData.filter(y => y.ID === ID);
        const OutBound = (filterData && filterData.length > 0) ? filterData[0] : [];

        const filtersummeryData: any = this.TotalSummery.filter(y => y.ID === 0);
        const SummeryData = (filtersummeryData && filtersummeryData.length > 0) ? filtersummeryData[0] : [];

        OutBound.Total.Revenue = OutBound.Voice.Revenue + OutBound.SMS.Revenue + OutBound.Data.Revenue;

        const CurruntDiscountPeriodCost = Number(x.get('CurrentDiscountperiodcost').value);
        const Forecastedcurrentperiod = Number(x.get('Forecastedcurrentperiod').value);
        // const Commitment = Number(x.get('Commitment').value);
        const Commitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        const Updatedtrafficsplit = Number(x.get('Updatedtrafficsplit').value);
        const Voice = x.get('Voice') as FormControl;
        const SMS = x.get('SMS') as FormControl;
        const Data = x.get('Data') as FormControl;


        const VoiceUnits = (SummeryData.Voice.Unit * Updatedtrafficsplit) / 100;
        OutBound.Voice.Contribution = (OutBound.Voice.Revenue * 100) / OutBound.Total.Revenue;
        const VoiceRevenew = (OutBound.Voice.Contribution * Commitment) / 100;
        const VoiceUnit_Price = VoiceRevenew / VoiceUnits;

        const SMSUnits = (SummeryData.SMS.Unit * Updatedtrafficsplit) / 100;
        OutBound.SMS.Contribution = (OutBound.SMS.Revenue * 100) / OutBound.Total.Revenue;
        const SMSRevenew = (OutBound.SMS.Contribution * Commitment) / 100;
        const SMSUnit_Price = SMSRevenew / SMSUnits;

        const DataUnits = (SummeryData.Data.Unit * Updatedtrafficsplit) / 100;
        OutBound.Data.Contribution = (OutBound.Data.Revenue * 100) / OutBound.Total.Revenue;
        const DataRevenew = (OutBound.Data.Contribution * Commitment) / 100;
        const DataUnit_Price = DataRevenew / DataUnits;

        const TotalUnits = VoiceUnits + SMSUnits + DataUnits;
        const TotalRevenew = VoiceRevenew + SMSRevenew + DataRevenew;
        const TotalUnit_Price = TotalRevenew / TotalUnits;

        Voice.patchValue(VoiceUnit_Price.toFixed(4));
        SMS.patchValue(SMSUnit_Price.toFixed(4));
        Data.patchValue(DataUnit_Price.toFixed(4));

        // const ForecastedOutboundcost = (TotalRevenew) / 7 * 12;
        const ForecastedOutboundcost = TotalRevenew;
        x.get('ForecastedOutboundcost').patchValue(Math.ceil(ForecastedOutboundcost));


        let Cost = 0;
        switch (Number(x.get('VarianceTypeID').value)) {
            case 1:
                //Budget Cost
                //Forecastedcurrentperiod
                Cost = Number(x.get('Forecastedcurrentperiod').value);
                break;
            case 2:
                // Baseline Cost
                //CurrentDiscountperiodcost
                Cost = Number(x.get('CurrentDiscountperiodcost').value);
                break;
        }
        const Variance = Math.ceil(ForecastedOutboundcost) - Cost;
        x.get('Variance').patchValue(Variance);

        this.varianceOutbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
        this.OutboundChart.push({
            ID: ID,
            Name: x.get('OperatorName').value,
            Commitment: Commitment,
            ForecastedOutboundcost: Math.ceil(ForecastedOutboundcost),
            Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiod').value : x.get('CurrentDiscountperiodcost').value
        });

        this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost = this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost +
            CurruntDiscountPeriodCost;
        this.OutBoundTotalRow.TotalForecastedcurrentperiod = this.OutBoundTotalRow.TotalForecastedcurrentperiod +
            Forecastedcurrentperiod;
        this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit = this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit +
            Number(x.get('CurrentOutboundtrafficsplit').value);
        this.OutBoundTotalRow.TotalUpdatedtrafficsplit = this.OutBoundTotalRow.TotalUpdatedtrafficsplit + Number(x.get('Updatedtrafficsplit').value);

        this.OutBoundTotalRow.TotalVoiceMo = this.OutBoundTotalRow.TotalVoiceMo +
            (Updatedtrafficsplit * Number(Voice.value)) / 100;
        this.OutBoundTotalRow.TotalSMS = this.OutBoundTotalRow.TotalSMS +
            (Updatedtrafficsplit * Number(SMS.value)) / 100;
        this.OutBoundTotalRow.TotalData = this.OutBoundTotalRow.TotalData +
            (Updatedtrafficsplit * Number(Data.value)) / 100;
        this.OutBoundTotalRow.TotalCommitment = this.OutBoundTotalRow.TotalCommitment + Commitment;
        this.OutBoundTotalRow.TotalForecastedOutboundcost = this.OutBoundTotalRow.TotalForecastedOutboundcost +
            Math.ceil(ForecastedOutboundcost);
        this.OutBoundTotalRow.TotalVariance = this.OutBoundTotalRow.TotalVariance +
            Math.ceil(Variance);
    }

    CalculateAYCEInbound(x: any, ID) {
        const filterData: any = this.iNBoundData.filter(y => y.ID === ID);
        const InBound = (filterData && filterData.length > 0) ? filterData[0] : [];

        InBound.Total.Revenue = InBound.Voice.Revenue + InBound.SMS.Revenue + InBound.Data.Revenue;

        const Scaleoflastyearstraffic = Number(x.get('Scaleoflastyearstraffic').value);
        const CurrentDiscountperiodrevenue = Number(x.get('CurrentDiscountperiodrevenue').value);
        const Forecastedcurrentperiodrevenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
        const Commitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        //parseInt(x.get('Commitment').value.replace(/,/g, ''))
        const Voice = x.get('Voice') as FormControl;
        const SMS = x.get('SMS') as FormControl;
        const Data = x.get('Data') as FormControl;

        const VoiceUnits = (InBound.Voice.Unit * (1 + Scaleoflastyearstraffic / 100));
        InBound.Voice.Contribution = (InBound.Voice.Revenue * 100) / InBound.Total.Revenue;
        const VoiceRevenew = (Commitment * InBound.Voice.Contribution) / 100;
        const VoiceUnit_Price = VoiceRevenew / VoiceUnits;

        const SMSUnits = (InBound.SMS.Unit * (1 + Scaleoflastyearstraffic / 100));
        InBound.SMS.Contribution = (InBound.SMS.Revenue * 100) / InBound.Total.Revenue;
        const SMSRevenew = (Commitment * InBound.SMS.Contribution) / 100;
        const SMSUnit_Price = SMSRevenew / SMSUnits;

        const DataUnits = (InBound.Data.Unit * (1 + Scaleoflastyearstraffic / 100));
        InBound.Data.Contribution = (InBound.Data.Revenue * 100) / InBound.Total.Revenue;
        const DataRevenew = (Commitment * InBound.Data.Contribution) / 100;
        const DataUnit_Price = DataRevenew / DataUnits;

        const TotalUnits = VoiceUnits + SMSUnits + DataUnits;
        const TotalRevenew = VoiceRevenew + SMSRevenew + DataRevenew;
        const TotalUnit_Price = TotalRevenew / TotalUnits;

        //const Newforecastedrevenue = (TotalRevenew) / 7 * 12;
        Voice.patchValue(VoiceUnit_Price.toFixed(4));
        SMS.patchValue(SMSUnit_Price.toFixed(4));
        Data.patchValue(DataUnit_Price.toFixed(4));

        const Newforecastedrevenue = TotalRevenew;
        x.get('Newforecastedrevenue').patchValue(Math.ceil(Newforecastedrevenue));

        let Revenue = 0;
        switch (Number(x.get('VarianceTypeID').value)) {
            case 1:
                //Budget Revenue
                //Forecastedcurrentperiodrevenue
                Revenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
                break;
            case 2:
                // Baseline Revenue
                //CurrentDiscountperiodrevenue
                Revenue = Number(x.get('CurrentDiscountperiodrevenue').value);
                break;
        }
        const Variance = Math.ceil(Newforecastedrevenue) - Revenue;
        x.get('Variance').patchValue(Variance);

        this.varianceInbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
        this.InboundChart.push({
            ID: ID,
            Name: x.get('OperatorName').value,
            Commitment: Commitment,
            Newforecastedrevenue: Math.ceil(Newforecastedrevenue),
            Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiodrevenue').value : x.get('CurrentDiscountperiodrevenue').value
        });

        this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue +
            CurrentDiscountperiodrevenue;
        this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue +
            Forecastedcurrentperiodrevenue;
        this.InBoundTotalRow.TotalScaleoflastyearstraffic = this.InBoundTotalRow.TotalScaleoflastyearstraffic + Number(x.get('Scaleoflastyearstraffic').value);
        this.InBoundTotalRow.TotalVoiceMo = this.InBoundTotalRow.TotalVoiceMo +
            (Scaleoflastyearstraffic * Number(Voice.value)) / 100;
        this.InBoundTotalRow.TotalSMS = this.InBoundTotalRow.TotalSMS +
            (Scaleoflastyearstraffic * Number(SMS.value)) / 100;
        this.InBoundTotalRow.TotalData = this.InBoundTotalRow.TotalData +
            (Scaleoflastyearstraffic * Number(Data.value)) / 100;
        this.InBoundTotalRow.TotalCommitment = this.InBoundTotalRow.TotalCommitment + Commitment;
        this.InBoundTotalRow.TotalNewforecastedrevenue = this.InBoundTotalRow.TotalNewforecastedrevenue +
            Math.ceil(Newforecastedrevenue);
        this.InBoundTotalRow.TotalVariance = this.InBoundTotalRow.TotalVariance +
            Math.ceil(Variance);
    }

    CalculateBalUnbalceOutbound(x: any, ID, newScreen2Form, isDefault, ischange, isPageLoad) {
        let iVoiceBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iDataBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iSMSBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iTotalBalanceUnbalance = this.balanceUnbalanceRowVariable;
        //#region outBound
        // const OutBoundArray = this.getArray('OutBound', newScreen2Form).value;
        const InBoundUnbalControl = this.getArray('InBound', newScreen2Form).controls.find(x => x.get('ID').value == 1 && x.get('TypeID').value == 2);
        const OutBoundUnbalControl = this.getArray('OutBound', newScreen2Form).controls.find(x => x.get('ID').value == 1 && x.get('TypeID').value == 2);
        const oCurruntDiscountPeriodCost = Number(x.get('CurrentDiscountperiodcost').value);
        const oForecastedcurrentperiod = Number(x.get('Forecastedcurrentperiod').value);
        const oCommitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        const oUpdatedtrafficsplit = Number(x.get('Updatedtrafficsplit').value);
        const oVoice = Number(x.get('Voice').value);
        const oSMS = Number(x.get('SMS').value);
        const oData = Number(x.get('Data').value);

        const ofilterData: any = this.outBoundData.filter(y => y.ID === ID);
        const OutBound = (ofilterData && ofilterData.length > 0) ? ofilterData[0] : [];

        const filtersummeryData: any = this.TotalSummery.filter(y => y.ID === 0);
        const OutBoundTotal = (filtersummeryData && filtersummeryData.length > 0) ? filtersummeryData[0] : [];

        OutBound.Total.Revenue = OutBound.Voice.Revenue + OutBound.SMS.Revenue + OutBound.Data.Revenue;


        const oVoiceUnits = (OutBoundTotal.Voice.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.Voice.Contribution = (OutBound.Voice.Revenue * 100) / OutBound.Total.Revenue;
        const oVoiceUnit_Price = oVoice;
        const oVoiceRevenew = oVoiceUnits * oVoiceUnit_Price;
        const oSMSUnits = (OutBoundTotal.SMS.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.SMS.Contribution = (OutBound.SMS.Revenue * 100) / OutBound.Total.Revenue;
        const oSMSUnit_Price = oSMS;
        const oSMSRevenew = oSMSUnits * oSMSUnit_Price;

        const oDataUnits = (OutBoundTotal.Data.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.Data.Contribution = (OutBound.Data.Revenue * 100) / OutBound.Total.Revenue;
        const oDataUnit_Price = oData;
        const oDataRevenew = oDataUnits * oDataUnit_Price;
        const oTotalUnits = oVoiceUnits + oSMSUnits + oDataUnits;
        const oTotalRevenew = oVoiceRevenew + oSMSRevenew + oDataRevenew;
        const oTotalUnit_Price = oTotalRevenew / oTotalUnits;
        const oForecastedOutboundcost = oTotalRevenew;
        //#endregion

        //#region Inbound
        const ifilterData: any = this.iNBoundData.filter(y => y.ID === ID);
        const InBound = (ifilterData && ifilterData.length > 0) ? ifilterData[0] : [];
        const InBoundFormArray = this.getArray('InBound', newScreen2Form);

        const outputrow = InBoundFormArray.controls.filter(x => x.get('ID').value == ID)[0] as FormGroup;
        const iScaleoflastyearstraffic = Number(outputrow.get('Scaleoflastyearstraffic').value);
        const iCurrentDiscountperiodrevenue = Number(outputrow.get('CurrentDiscountperiodrevenue').value);
        const iForecastedcurrentperiodrevenue = Number(outputrow.get('Forecastedcurrentperiodrevenue').value);

        const iCommitment = Number(outputrow.get('Commitment').value ? parseInt(outputrow.get('Commitment').value.replace(/,/g, '')) : 0);
        const iVoice = Number(outputrow.get('Voice').value);
        const iSMS = Number(outputrow.get('SMS').value);
        const iData = Number(outputrow.get('Data').value);



        const iVoiceUnits = (InBound.Voice.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iVoiceUnit_Price = iVoice;
        const iVoiceRevenew = iVoiceUnits * iVoiceUnit_Price;

        const iSMSUnits = (InBound.SMS.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iSMSUnit_Price = iSMS;
        const iSMSRevenew = iSMSUnits * iSMSUnit_Price;

        const iDataUnits = (InBound.Data.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iDataUnit_Price = iData;
        const iDataRevenew = iDataUnits * iDataUnit_Price;

        const iTotalUnits = iVoiceUnits + iSMSUnits + iDataUnits;
        const iTotalRevenew = iVoiceRevenew + iSMSRevenew + iDataRevenew;
        const iTotalUnit_Price = iTotalRevenew / iTotalUnits;

        //const Newforecastedrevenue = (TotalRevenew) / 7 * 12;
        const iNewforecastedrevenue = iTotalRevenew;
        //#endregion

        if (iVoiceUnits > oVoiceUnits) {
            if (!isPageLoad) {
                x.get('ForecastedOutboundcost').patchValue(Math.ceil(oForecastedOutboundcost));
            }
            let Cost = 0;
            switch (Number(x.get('VarianceTypeID').value)) {
                case 1:
                    //Budget Cost
                    //Forecastedcurrentperiod
                    Cost = Number(x.get('Forecastedcurrentperiod').value);
                    break;
                case 2:
                    // Baseline Cost
                    //CurrentDiscountperiodcost
                    Cost = Number(x.get('CurrentDiscountperiodcost').value);
                    break;
            }
            const Variance = Math.ceil(Number(x.get('ForecastedOutboundcost').value)) - Cost;
            x.get('Variance').patchValue(Variance);

            this.varianceOutbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
            this.OutboundChart.push({
                ID: ID,
                Name: x.get('OperatorName').value,
                Commitment: oCommitment,
                ForecastedOutboundcost: Math.ceil(oForecastedOutboundcost),
                Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiod').value : x.get('CurrentDiscountperiodcost').value
            });

            if (!isDefault) {
                if (ischange) {
                    outputrow.get('Voice').patchValue(x.get('Voice').value);
                    outputrow.get('SMS').patchValue(x.get('SMS').value);
                    outputrow.get('Data').patchValue(x.get('Data').value);

                    // //Updated 19-09-2020 suggested by shubham
                    // InBoundUnbalControl.get('Voice').patchValue(OutBoundUnbalControl.get('Voice').value);
                    // InBoundUnbalControl.get('SMS').patchValue(OutBoundUnbalControl.get('SMS').value);
                    // InBoundUnbalControl.get('Data').patchValue(OutBoundUnbalControl.get('Data').value);
                }
            }

            this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost = this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost +
                oCurruntDiscountPeriodCost;
            this.OutBoundTotalRow.TotalForecastedcurrentperiod = this.OutBoundTotalRow.TotalForecastedcurrentperiod +
                oForecastedcurrentperiod;
            this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit = this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit +
                Number(x.get('CurrentOutboundtrafficsplit').value);
            this.OutBoundTotalRow.TotalUpdatedtrafficsplit = this.OutBoundTotalRow.TotalUpdatedtrafficsplit + Number(x.get('Updatedtrafficsplit').value);
            this.OutBoundTotalRow.TotalVoiceMo = this.OutBoundTotalRow.TotalVoiceMo +
                (oUpdatedtrafficsplit * oVoice) / 100;
            this.OutBoundTotalRow.TotalSMS = this.OutBoundTotalRow.TotalSMS +
                (oUpdatedtrafficsplit * oSMS) / 100;
            this.OutBoundTotalRow.TotalData = this.OutBoundTotalRow.TotalData +
                (oUpdatedtrafficsplit * oData) / 100;
            this.OutBoundTotalRow.TotalCommitment = this.OutBoundTotalRow.TotalCommitment + oCommitment;
            this.OutBoundTotalRow.TotalForecastedOutboundcost = this.OutBoundTotalRow.TotalForecastedOutboundcost +
                Math.ceil(oForecastedOutboundcost);
            this.OutBoundTotalRow.TotalVariance = this.OutBoundTotalRow.TotalVariance +
                Math.ceil(Variance);

        } else {
            if (!isDefault) {
                this.outBoundUnbalanceRow = null;
                this.inBoundUnbalanceRow = null;
                const OutBoundunbalRow = OutBoundUnbalControl.value;
                iVoiceBalanceUnbalance = this.bindBalanceUnbalanceRow(oVoiceUnits, iVoiceUnits, iVoiceUnit_Price, oVoiceUnit_Price, OutBoundunbalRow.Voice ? OutBoundunbalRow.Voice : null, true, isDefault, ischange);
                iDataBalanceUnbalance = this.bindBalanceUnbalanceRow(oDataUnits, iDataUnits, iDataUnit_Price, oDataUnit_Price, OutBoundunbalRow.Data ? OutBoundunbalRow.Data : null, true, isDefault, ischange);
                iSMSBalanceUnbalance = this.bindBalanceUnbalanceRow(oSMSUnits, iSMSUnits, iSMSUnit_Price, oSMSUnit_Price, OutBoundunbalRow.SMS ? OutBoundunbalRow.SMS : null, true, isDefault, ischange);
                iTotalBalanceUnbalance = this.bindBalanceUnbalanceTotalRow(iTotalBalanceUnbalance, iVoiceBalanceUnbalance, iDataBalanceUnbalance, iSMSBalanceUnbalance);
                if (!isPageLoad) {
                    x.get('ForecastedOutboundcost').patchValue(Math.ceil(iTotalBalanceUnbalance.TotalRevenue));
                    outputrow.get('Newforecastedrevenue').patchValue(Math.ceil(iTotalBalanceUnbalance.BalancedRevenue));
                }

                let Cost = 0;
                switch (Number(x.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Cost
                        //Forecastedcurrentperiod
                        Cost = Number(x.get('Forecastedcurrentperiod').value);
                        break;
                    case 2:
                        // Baseline Cost
                        //CurrentDiscountperiodcost
                        Cost = Number(x.get('CurrentDiscountperiodcost').value);
                        break;
                }
                const oVariance = Math.ceil(Number(x.get('ForecastedOutboundcost').value)) - Cost;
                x.get('Variance').patchValue(oVariance);

                let Revenue = 0;
                switch (Number(outputrow.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Revenue
                        //Forecastedcurrentperiodrevenue
                        Revenue = Number(outputrow.get('Forecastedcurrentperiodrevenue').value);
                        break;
                    case 2:
                        // Baseline Revenue
                        //CurrentDiscountperiodrevenue
                        Revenue = Number(outputrow.get('CurrentDiscountperiodrevenue').value);
                        break;
                }

                const iVariance = Math.ceil(Number(outputrow.get('Newforecastedrevenue').value)) - Revenue;
                outputrow.get('Variance').patchValue(iVariance);


                this.varianceOutbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
                this.OutboundChart.push({
                    ID: ID,
                    Name: x.get('OperatorName').value,
                    Commitment: oCommitment,
                    ForecastedOutboundcost: Math.ceil(iTotalBalanceUnbalance.TotalRevenue),
                    Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiod').value : x.get('CurrentDiscountperiodcost').value
                });

                this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost = this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost +
                    oCurruntDiscountPeriodCost;
                this.OutBoundTotalRow.TotalForecastedcurrentperiod = this.OutBoundTotalRow.TotalForecastedcurrentperiod +
                    oForecastedcurrentperiod;
                this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit = this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit +
                    Number(x.get('CurrentOutboundtrafficsplit').value);
                this.OutBoundTotalRow.TotalUpdatedtrafficsplit = this.OutBoundTotalRow.TotalUpdatedtrafficsplit + Number(x.get('Updatedtrafficsplit').value);
                this.OutBoundTotalRow.TotalVoiceMo = this.OutBoundTotalRow.TotalVoiceMo +
                    (oUpdatedtrafficsplit * oVoice) / 100;
                this.OutBoundTotalRow.TotalSMS = this.OutBoundTotalRow.TotalSMS +
                    (oUpdatedtrafficsplit * oSMS) / 100;
                this.OutBoundTotalRow.TotalData = this.OutBoundTotalRow.TotalData +
                    (oUpdatedtrafficsplit * oData) / 100;
                this.OutBoundTotalRow.TotalCommitment = this.OutBoundTotalRow.TotalCommitment + oCommitment;
                this.OutBoundTotalRow.TotalForecastedOutboundcost = this.OutBoundTotalRow.TotalForecastedOutboundcost +
                    Math.ceil(iTotalBalanceUnbalance.TotalRevenue);
                this.OutBoundTotalRow.TotalVariance = this.OutBoundTotalRow.TotalVariance +
                    Math.ceil(oVariance);

                if (ischange) {
                    OutBoundUnbalControl.get('Voice').patchValue(iVoiceBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('SMS').patchValue(iSMSBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('Data').patchValue(iDataBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));

                    outputrow.get('Voice').patchValue(x.get('Voice').value);
                    outputrow.get('SMS').patchValue(x.get('SMS').value);
                    outputrow.get('Data').patchValue(x.get('Data').value);

                    // //Updated 19-09-2020 suggested by shubham
                    // InBoundUnbalControl.get('Voice').patchValue(OutBoundUnbalControl.get('Voice').value);
                    // InBoundUnbalControl.get('SMS').patchValue(OutBoundUnbalControl.get('SMS').value);
                    // InBoundUnbalControl.get('Data').patchValue(OutBoundUnbalControl.get('Data').value);

                }
                else {
                    x.get('Voice').setValue(iVoiceBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('SMS').setValue(iSMSBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('Data').setValue(iDataBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('DealType').setValue('Bal');
                    outputrow.get('DealType').setValue('Bal');
                }
            } else {
                const OutBoundunbalRow = OutBoundUnbalControl.value;
                iVoiceBalanceUnbalance = this.bindBalanceUnbalanceRow(oVoiceUnits, iVoiceUnits, iVoiceUnit_Price, oVoiceUnit_Price, OutBoundunbalRow.Voice ? OutBoundunbalRow.Voice : null, true, isDefault, ischange);
                iDataBalanceUnbalance = this.bindBalanceUnbalanceRow(oDataUnits, iDataUnits, iDataUnit_Price, oDataUnit_Price, OutBoundunbalRow.Data ? OutBoundunbalRow.Data : null, true, isDefault, ischange);
                iSMSBalanceUnbalance = this.bindBalanceUnbalanceRow(oSMSUnits, iSMSUnits, iSMSUnit_Price, oSMSUnit_Price, OutBoundunbalRow.SMS ? OutBoundunbalRow.SMS : null, true, isDefault, ischange);
                iTotalBalanceUnbalance = this.bindBalanceUnbalanceTotalRow(iTotalBalanceUnbalance, iVoiceBalanceUnbalance, iDataBalanceUnbalance, iSMSBalanceUnbalance);

                if (!isPageLoad) {
                    x.get('ForecastedOutboundcost').patchValue(Math.ceil(iTotalBalanceUnbalance.TotalRevenue));
                }
                let Cost = 0;
                switch (Number(x.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Cost
                        //Forecastedcurrentperiod
                        Cost = Number(x.get('Forecastedcurrentperiod').value);
                        break;
                    case 2:
                        // Baseline Cost
                        //CurrentDiscountperiodcost
                        Cost = Number(x.get('CurrentDiscountperiodcost').value);
                        break;
                }
                const oVariance = Math.ceil(Math.ceil(Number(x.get('ForecastedOutboundcost').value))) - Cost;

                x.get('Variance').patchValue(oVariance);

                this.varianceOutbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';

                this.OutboundChart.push({
                    ID: ID,
                    Name: x.get('OperatorName').value,
                    Commitment: oCommitment,
                    ForecastedOutboundcost: Math.ceil(iTotalBalanceUnbalance.TotalRevenue),
                    Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiod').value : x.get('CurrentDiscountperiodcost').value
                });

                this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost = this.OutBoundTotalRow.TotalCurruntDiscountPeriodCost +
                    oCurruntDiscountPeriodCost;
                this.OutBoundTotalRow.TotalForecastedcurrentperiod = this.OutBoundTotalRow.TotalForecastedcurrentperiod +
                    oForecastedcurrentperiod;
                this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit = this.OutBoundTotalRow.TotalCurrentOutboundtrafficsplit +
                    Number(x.get('CurrentOutboundtrafficsplit').value);
                this.OutBoundTotalRow.TotalUpdatedtrafficsplit = this.OutBoundTotalRow.TotalUpdatedtrafficsplit + Number(x.get('Updatedtrafficsplit').value);
                this.OutBoundTotalRow.TotalVoiceMo = this.OutBoundTotalRow.TotalVoiceMo +
                    (oUpdatedtrafficsplit * oVoice) / 100;
                this.OutBoundTotalRow.TotalSMS = this.OutBoundTotalRow.TotalSMS +
                    (oUpdatedtrafficsplit * oSMS) / 100;
                this.OutBoundTotalRow.TotalData = this.OutBoundTotalRow.TotalData +
                    (oUpdatedtrafficsplit * oData) / 100;
                this.OutBoundTotalRow.TotalCommitment = this.OutBoundTotalRow.TotalCommitment + oCommitment;
                this.OutBoundTotalRow.TotalForecastedOutboundcost = this.OutBoundTotalRow.TotalForecastedOutboundcost +
                    Math.ceil(iTotalBalanceUnbalance.TotalRevenue);
                this.OutBoundTotalRow.TotalVariance = this.OutBoundTotalRow.TotalVariance +
                    Math.ceil(oVariance);
                if (ischange) {
                    OutBoundUnbalControl.get('Voice').patchValue(iVoiceBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('SMS').patchValue(iSMSBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('Data').patchValue(iDataBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));

                    InBoundUnbalControl.get('Voice').patchValue(oVoiceUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('SMS').patchValue(oSMSUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('Data').patchValue(oDataUnit_Price.toFixed(4));

                }

            }
        }
    }

    CalculateBalUnbalceInbound(x: any, ID, newScreen2Form, isDefault, ischange, isPageLoad) {
        //#region Inbound
        let iVoiceBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iDataBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iSMSBalanceUnbalance = this.balanceUnbalanceRowVariable;
        let iTotalBalanceUnbalance = this.balanceUnbalanceRowVariable;
        const ifilterData: any = this.iNBoundData.filter(y => y.ID === ID);
        const InBound = (ifilterData && ifilterData.length > 0) ? ifilterData[0] : [];
        const iScaleoflastyearstraffic = Number(x.get('Scaleoflastyearstraffic').value);
        const InBoundUnbalControl = this.getArray('InBound', newScreen2Form).controls.find(x => x.get('ID').value == 1 && x.get('TypeID').value == 2);
        const OutBoundUnbalControl = this.getArray('OutBound', newScreen2Form).controls.find(x => x.get('ID').value == 1 && x.get('TypeID').value == 2);
        const iCurrentDiscountperiodrevenue = Number(x.get('CurrentDiscountperiodrevenue').value);
        const iForecastedcurrentperiodrevenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
        const iCommitment = Number(x.get('Commitment').value ? parseInt(x.get('Commitment').value.replace(/,/g, '')) : 0);
        const iVoice = Number(x.get('Voice').value);
        const iSMS = Number(x.get('SMS').value);
        const iData = Number(x.get('Data').value);

        const iVoiceUnits = (InBound.Voice.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iVoiceUnit_Price = iVoice;
        const iVoiceRevenew = iVoiceUnits * iVoiceUnit_Price;
        const iSMSUnits = (InBound.SMS.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iSMSUnit_Price = iSMS;
        const iSMSRevenew = iSMSUnits * iSMSUnit_Price;
        const iDataUnits = (InBound.Data.Unit * (1 + iScaleoflastyearstraffic / 100));
        const iDataUnit_Price = iData;
        const iDataRevenew = iDataUnits * iDataUnit_Price;
        const iTotalUnits = iVoiceUnits + iSMSUnits + iDataUnits;
        const iTotalRevenew = iVoiceRevenew + iSMSRevenew + iDataRevenew;
        const iTotalUnit_Price = iTotalRevenew / iTotalUnits;
        const iNewforecastedrevenue = iTotalRevenew;
        //#endregion

        //#region outBound
        const OutBoundFormArray = this.getArray('OutBound', newScreen2Form);
        const outputrow = OutBoundFormArray.controls.filter(x => x.get('ID').value == ID)[0] as FormGroup;
        const oCurruntDiscountPeriodCost = Number(outputrow.get('CurrentDiscountperiodcost').value);
        const oForecastedcurrentperiod = Number(outputrow.get('Forecastedcurrentperiod').value);
        const oCommitment = Number(outputrow.get('Commitment').value ? parseInt(outputrow.get('Commitment').value.replace(/,/g, '')) : 0);
        const oUpdatedtrafficsplit = Number(outputrow.get('Updatedtrafficsplit').value);
        const oVoice = Number(outputrow.get('Voice').value);
        const oSMS = Number(outputrow.get('SMS').value);
        const oData = Number(outputrow.get('Data').value);

        const ofilterData: any = this.outBoundData.filter(y => y.ID === ID);
        const OutBound = (ofilterData && ofilterData.length > 0) ? ofilterData[0] : [];
        const filtersummeryData: any = this.TotalSummery.filter(y => y.ID === 0);
        const OutBoundTotal = (filtersummeryData && filtersummeryData.length > 0) ? filtersummeryData[0] : [];

        OutBound.Total.Revenue = OutBound.Voice.Revenue + OutBound.SMS.Revenue + OutBound.Data.Revenue;

        //voice
        const oVoiceUnits = (OutBoundTotal.Voice.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.Voice.Contribution = (OutBound.Voice.Revenue * 100) / OutBound.Total.Revenue;
        const oVoiceUnit_Price = oVoice;
        const oVoiceRevenew = oVoiceUnits * oVoiceUnit_Price;
        //Sms
        const oSMSUnits = (OutBoundTotal.SMS.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.SMS.Contribution = (OutBound.SMS.Revenue * 100) / OutBound.Total.Revenue;
        const oSMSUnit_Price = oSMS;
        const oSMSRevenew = oSMSUnits * oSMSUnit_Price;
        //Data
        const oDataUnits = (OutBoundTotal.Data.Unit * oUpdatedtrafficsplit) / 100;
        OutBound.Data.Contribution = (OutBound.Data.Revenue * 100) / OutBound.Total.Revenue;
        const oDataUnit_Price = oData;
        const oDataRevenew = oDataUnits * oDataUnit_Price;
        //Total
        const oTotalUnits = oVoiceUnits + oSMSUnits + oDataUnits;
        const oTotalRevenew = oVoiceRevenew + oSMSRevenew + oDataRevenew;
        const oTotalUnit_Price = oTotalRevenew / oTotalUnits;
        const oForecastedOutboundcost = oTotalRevenew;
        //#endregion

        if (oVoiceUnits > iVoiceUnits) {
            if (!isPageLoad) {
                x.get('Newforecastedrevenue').patchValue(Math.ceil(iNewforecastedrevenue));
            }
            let Revenue = 0;
            switch (Number(x.get('VarianceTypeID').value)) {
                case 1:
                    //Budget Revenue
                    //Forecastedcurrentperiodrevenue
                    Revenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
                    break;
                case 2:
                    // Baseline Revenue
                    //CurrentDiscountperiodrevenue
                    Revenue = Number(x.get('CurrentDiscountperiodrevenue').value);
                    break;
            }

            const iVariance = Math.ceil(Number(x.get('Newforecastedrevenue').value)) - Revenue;
            x.get('Variance').patchValue(iVariance);

            //bind Iutbound chart
            this.varianceInbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
            this.InboundChart.push({
                ID: ID,
                Name: x.get('OperatorName').value,
                Commitment: iCommitment,
                Newforecastedrevenue: Math.ceil(iNewforecastedrevenue),
                Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiodrevenue').value : x.get('CurrentDiscountperiodrevenue').value
            });

            if (!isDefault) {
                if (ischange) {
                    outputrow.get('Voice').patchValue(x.get('Voice').value);
                    outputrow.get('SMS').patchValue(x.get('SMS').value);
                    outputrow.get('Data').patchValue(x.get('Data').value);

                    //Updated 19-09-2020 suggested by shubham
                    // OutBoundUnbalControl.get('Voice').patchValue(InBoundUnbalControl.get('Voice').value);
                    // OutBoundUnbalControl.get('SMS').patchValue(InBoundUnbalControl.get('SMS').value);
                    // OutBoundUnbalControl.get('Data').patchValue(InBoundUnbalControl.get('Data').value);
                }
            }

            this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue +
                iCurrentDiscountperiodrevenue;
            this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue +
                iForecastedcurrentperiodrevenue;
            this.InBoundTotalRow.TotalScaleoflastyearstraffic = this.InBoundTotalRow.TotalScaleoflastyearstraffic + Number(x.get('Scaleoflastyearstraffic').value);
            this.InBoundTotalRow.TotalVoiceMo = this.InBoundTotalRow.TotalVoiceMo +
                (iScaleoflastyearstraffic * iVoice) / 100;
            this.InBoundTotalRow.TotalSMS = this.InBoundTotalRow.TotalSMS +
                (iScaleoflastyearstraffic * iSMS) / 100;
            this.InBoundTotalRow.TotalData = this.InBoundTotalRow.TotalData +
                (iScaleoflastyearstraffic * iData) / 100;
            this.InBoundTotalRow.TotalCommitment = this.InBoundTotalRow.TotalCommitment + iCommitment;
            this.InBoundTotalRow.TotalNewforecastedrevenue = this.InBoundTotalRow.TotalNewforecastedrevenue +
                Math.ceil(iNewforecastedrevenue);
            this.InBoundTotalRow.TotalVariance = this.InBoundTotalRow.TotalVariance +
                Math.ceil(iVariance);
        } else {
            if (!isDefault) {
                this.inBoundUnbalanceRow = null;
                this.outBoundUnbalanceRow = null;
                const InBoundunbalRow = InBoundUnbalControl.value;
                iVoiceBalanceUnbalance = this.bindBalanceUnbalanceRow(oVoiceUnits, iVoiceUnits, iVoiceUnit_Price, oVoiceUnit_Price, InBoundunbalRow.Voice ? InBoundunbalRow.Voice : null, false, isDefault, ischange);
                iDataBalanceUnbalance = this.bindBalanceUnbalanceRow(oDataUnits, iDataUnits, iDataUnit_Price, oDataUnit_Price, InBoundunbalRow.Data ? InBoundunbalRow.Data : null, false, isDefault, ischange);
                iSMSBalanceUnbalance = this.bindBalanceUnbalanceRow(oSMSUnits, iSMSUnits, iSMSUnit_Price, oSMSUnit_Price, InBoundunbalRow.SMS ? InBoundunbalRow.SMS : null, false, isDefault, ischange);
                iTotalBalanceUnbalance = this.bindBalanceUnbalanceTotalRow(iTotalBalanceUnbalance, iVoiceBalanceUnbalance, iDataBalanceUnbalance, iSMSBalanceUnbalance);

                x.get('Newforecastedrevenue').patchValue(Math.ceil(iTotalBalanceUnbalance.TotalRevenue));
                let Revenue = 0;
                switch (Number(x.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Revenue
                        //Forecastedcurrentperiodrevenue
                        Revenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
                        break;
                    case 2:
                        // Baseline Revenue
                        //CurrentDiscountperiodrevenue
                        Revenue = Number(x.get('CurrentDiscountperiodrevenue').value);
                        break;
                }

                const iVariance = Math.ceil(iTotalBalanceUnbalance.TotalRevenue) - Revenue;
                x.get('Variance').patchValue(iVariance);

                outputrow.get('ForecastedOutboundcost').patchValue(Math.ceil(iTotalBalanceUnbalance.BalancedRevenue));
                let Cost = 0;
                switch (Number(outputrow.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Cost
                        //Forecastedcurrentperiod
                        Cost = Number(outputrow.get('Forecastedcurrentperiod').value);
                        break;
                    case 2:
                        // Baseline Cost
                        //CurrentDiscountperiodcost
                        Cost = Number(outputrow.get('CurrentDiscountperiodcost').value);
                        break;
                }
                const oVariance = Math.ceil(iTotalBalanceUnbalance.BalancedRevenue) - Cost;
                outputrow.get('Variance').patchValue(oVariance);

                //bind Iutbound chart
                this.varianceInbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
                this.InboundChart.push({
                    ID: ID,
                    Name: x.get('OperatorName').value,
                    Commitment: iCommitment,
                    Newforecastedrevenue: Math.ceil(iTotalBalanceUnbalance.TotalRevenue),
                    Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiodrevenue').value : x.get('CurrentDiscountperiodrevenue').value
                });

                this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue +
                    iCurrentDiscountperiodrevenue;
                this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue +
                    iForecastedcurrentperiodrevenue;
                this.InBoundTotalRow.TotalScaleoflastyearstraffic = this.InBoundTotalRow.TotalScaleoflastyearstraffic + Number(x.get('Scaleoflastyearstraffic').value);
                this.InBoundTotalRow.TotalVoiceMo = this.InBoundTotalRow.TotalVoiceMo +
                    (iScaleoflastyearstraffic * iVoice) / 100;
                this.InBoundTotalRow.TotalSMS = this.InBoundTotalRow.TotalSMS +
                    (iScaleoflastyearstraffic * iSMS) / 100;
                this.InBoundTotalRow.TotalData = this.InBoundTotalRow.TotalData +
                    (iScaleoflastyearstraffic * iData) / 100;
                this.InBoundTotalRow.TotalCommitment = this.InBoundTotalRow.TotalCommitment + iCommitment;
                this.InBoundTotalRow.TotalNewforecastedrevenue = this.InBoundTotalRow.TotalNewforecastedrevenue +
                    Math.ceil(iTotalBalanceUnbalance.TotalRevenue);

                this.InBoundTotalRow.TotalVariance = this.InBoundTotalRow.TotalVariance +
                    Math.ceil(iVariance);

                if (ischange) {
                    InBoundUnbalControl.get('Voice').patchValue(iVoiceBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('SMS').patchValue(iSMSBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('Data').patchValue(iDataBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));

                    outputrow.get('Voice').patchValue(x.get('Voice').value);
                    outputrow.get('SMS').patchValue(x.get('SMS').value);
                    outputrow.get('Data').patchValue(x.get('Data').value);

                    //Updated 19-09-2020 suggested by shubham
                    // OutBoundUnbalControl.get('Voice').patchValue(InBoundUnbalControl.get('Voice').value);
                    // OutBoundUnbalControl.get('SMS').patchValue(InBoundUnbalControl.get('SMS').value);
                    // OutBoundUnbalControl.get('Data').patchValue(InBoundUnbalControl.get('Data').value);


                } else {
                    x.get('Voice').setValue(iVoiceBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('SMS').setValue(iSMSBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('Data').setValue(iDataBalanceUnbalance.BalancedUnit_Price.toFixed(4));
                    x.get('DealType').setValue('Bal');
                    outputrow.get('DealType').setValue('Bal');
                }
            } else {
                this.inBoundUnbalanceRow = null;
                this.outBoundUnbalanceRow = null;
                const InBoundunbalRow = InBoundUnbalControl.value;
                iVoiceBalanceUnbalance = this.bindBalanceUnbalanceRow(oVoiceUnits, iVoiceUnits, iVoiceUnit_Price, oVoiceUnit_Price, InBoundunbalRow.Voice ? InBoundunbalRow.Voice : null, isDefault, ischange);
                iDataBalanceUnbalance = this.bindBalanceUnbalanceRow(oDataUnits, iDataUnits, iDataUnit_Price, oDataUnit_Price, InBoundunbalRow.Data ? InBoundunbalRow.Data : null, isDefault, ischange);
                iSMSBalanceUnbalance = this.bindBalanceUnbalanceRow(oSMSUnits, iSMSUnits, iSMSUnit_Price, oSMSUnit_Price, InBoundunbalRow.SMS ? InBoundunbalRow.SMS : null, isDefault, ischange);
                iTotalBalanceUnbalance = this.bindBalanceUnbalanceTotalRow(iTotalBalanceUnbalance, iVoiceBalanceUnbalance, iDataBalanceUnbalance, iSMSBalanceUnbalance);

                x.get('Newforecastedrevenue').patchValue(Math.ceil(iTotalBalanceUnbalance.TotalRevenue));

                let Revenue = 0;
                switch (Number(x.get('VarianceTypeID').value)) {
                    case 1:
                        //Budget Revenue
                        //Forecastedcurrentperiodrevenue
                        Revenue = Number(x.get('Forecastedcurrentperiodrevenue').value);
                        break;
                    case 2:
                        // Baseline Revenue
                        //CurrentDiscountperiodrevenue
                        Revenue = Number(x.get('CurrentDiscountperiodrevenue').value);
                        break;
                }

                const iVariance = Math.ceil(iTotalBalanceUnbalance.TotalRevenue) - Revenue;
                x.get('Variance').patchValue(iVariance);

                this.varianceInbound = x.get('VarianceTypeID').value === '1' ? 'Budget' : 'Baseline';
                this.InboundChart.push({
                    ID: ID,
                    Name: x.get('OperatorName').value,
                    Commitment: iCommitment,
                    Newforecastedrevenue: Math.ceil(iTotalBalanceUnbalance.TotalRevenue),
                    Variance: x.get('VarianceTypeID').value === 1 ? x.get('Forecastedcurrentperiodrevenue').value : x.get('CurrentDiscountperiodrevenue').value
                });

                this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue = this.InBoundTotalRow.TotalCurrentDiscountperiodrevenue +
                    iCurrentDiscountperiodrevenue;
                this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue = this.InBoundTotalRow.TotalForecastedcurrentperiodrevenue +
                    iForecastedcurrentperiodrevenue;
                this.InBoundTotalRow.TotalScaleoflastyearstraffic = this.InBoundTotalRow.TotalScaleoflastyearstraffic + Number(x.get('Scaleoflastyearstraffic').value);
                this.InBoundTotalRow.TotalVoiceMo = this.InBoundTotalRow.TotalVoiceMo +
                    (iScaleoflastyearstraffic * iVoice) / 100;
                this.InBoundTotalRow.TotalSMS = this.InBoundTotalRow.TotalSMS +
                    (iScaleoflastyearstraffic * iSMS) / 100;
                this.InBoundTotalRow.TotalData = this.InBoundTotalRow.TotalData +
                    (iScaleoflastyearstraffic * iData) / 100;
                this.InBoundTotalRow.TotalCommitment = this.InBoundTotalRow.TotalCommitment + iCommitment;
                this.InBoundTotalRow.TotalNewforecastedrevenue = this.InBoundTotalRow.TotalNewforecastedrevenue +
                    Math.ceil(iTotalBalanceUnbalance.TotalRevenue);
                this.InBoundTotalRow.TotalVariance = this.InBoundTotalRow.TotalVariance +
                    Math.ceil(iVariance);
                if (ischange) {
                    InBoundUnbalControl.get('Voice').patchValue(iVoiceBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('SMS').patchValue(iSMSBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    InBoundUnbalControl.get('Data').patchValue(iDataBalanceUnbalance.UnbalancedUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('Voice').patchValue(iVoiceUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('SMS').patchValue(iSMSUnit_Price.toFixed(4));
                    OutBoundUnbalControl.get('Data').patchValue(iDataUnit_Price.toFixed(4));

                }
            }
        }

    }

    bindBalanceUnbalanceTotalRow(iTotalBalanceUnbalance, iVoiceBalanceUnbalance, iDataBalanceUnbalance, iSMSBalanceUnbalance) {
        iTotalBalanceUnbalance.TotalUnit = iVoiceBalanceUnbalance.TotalUnit + iDataBalanceUnbalance.TotalUnit + iSMSBalanceUnbalance.TotalUnit;
        iTotalBalanceUnbalance.BalancedUnits = iVoiceBalanceUnbalance.BalancedUnits + iDataBalanceUnbalance.BalancedUnits + iSMSBalanceUnbalance.BalancedUnits;
        iTotalBalanceUnbalance.BalancedUnit_Price = iVoiceBalanceUnbalance.BalancedUnit_Price + iDataBalanceUnbalance.BalancedUnit_Price + iSMSBalanceUnbalance.BalancedUnit_Price;
        //  iTotalBalanceUnbalance.TotalRevenueasperaveragerate = iVoiceBalanceUnbalance.TotalRevenueasperaveragerate + iDataBalanceUnbalance.TotalRevenueasperaveragerate + iSMSBalanceUnbalance.TotalRevenueasperaveragerate;
        iTotalBalanceUnbalance.UnbalancedUnits = iVoiceBalanceUnbalance.UnbalancedUnits + iDataBalanceUnbalance.UnbalancedUnits + iSMSBalanceUnbalance.UnbalancedUnits;
        iTotalBalanceUnbalance.BalancedRevenue = iVoiceBalanceUnbalance.BalancedRevenue + iDataBalanceUnbalance.BalancedRevenue + iSMSBalanceUnbalance.BalancedRevenue;
        iTotalBalanceUnbalance.UnbalancedRevenue = iVoiceBalanceUnbalance.UnbalancedRevenue + iDataBalanceUnbalance.UnbalancedRevenue + iSMSBalanceUnbalance.UnbalancedRevenue;
        iTotalBalanceUnbalance.UnbalancedUnit_Price = iTotalBalanceUnbalance.UnbalancedUnits / iTotalBalanceUnbalance.UnbalancedRevenue;
        iTotalBalanceUnbalance.TotalRevenue = iVoiceBalanceUnbalance.TotalRevenue + iDataBalanceUnbalance.TotalRevenue + iSMSBalanceUnbalance.TotalRevenue;
        return iTotalBalanceUnbalance;
    }

    bindBalanceUnbalanceRow(oUnits, iUnits, iUnit_Price, oUnit_Price, unbalanceUnit_Price, isOutbound = false, isDefault = false, isChange = false) {
        const iBalanceUnbalance: any = {};
        if (isOutbound) {
            iBalanceUnbalance.TotalUnit = oUnits;
            iBalanceUnbalance.BalancedUnits = iUnits;
            iBalanceUnbalance.BalancedUnit_Price = (!isDefault && isChange) ? oUnit_Price : iUnit_Price;
            iBalanceUnbalance.UnbalancedUnits = (oUnits - iUnits) > 0 ? (oUnits - iUnits) : 0;
            iBalanceUnbalance.UnbalancedUnit_Price = Number(unbalanceUnit_Price);
        } else {
            iBalanceUnbalance.TotalUnit = iUnits;
            iBalanceUnbalance.BalancedUnits = oUnits;
            iBalanceUnbalance.BalancedUnit_Price = (!isDefault && isChange) ? iUnit_Price : oUnit_Price;
            iBalanceUnbalance.UnbalancedUnits = (iUnits - oUnits) > 0 ? (iUnits - oUnits) : 0;
            iBalanceUnbalance.UnbalancedUnit_Price = Number(unbalanceUnit_Price);
        }
        iBalanceUnbalance.BalancedRevenue = (iBalanceUnbalance.BalancedUnits * iBalanceUnbalance.BalancedUnit_Price);
        iBalanceUnbalance.UnbalancedRevenue = iBalanceUnbalance.UnbalancedUnits * iBalanceUnbalance.UnbalancedUnit_Price;
        iBalanceUnbalance.TotalRevenue = iBalanceUnbalance.BalancedRevenue + iBalanceUnbalance.UnbalancedRevenue;
        return iBalanceUnbalance;
    }

    bindScreen2(item?) {
        const newScreen2Form = new FormGroup({
            'iVariance': new FormControl({ value: (item && item.iVariance) ? item.iVariance : '', disabled: false }),
            'oVariance': new FormControl({ value: (item && item.oVariance) ? item.oVariance : '', disabled: false }),
            'Country': new FormControl({ value: (item && item.Country) ? item.Country : '', disabled: false }),
            'NetPosition': new FormControl({ value: (item && item.NetPosition) ? item.NetPosition : '', disabled: false }),
            'OutBound': this.bindOutBuond((item && item.OutBound) ? item.OutBound : []),
            'InBound': this.bindInBound((item && item.InBound) ? item.InBound : []),
            'Net': this.bindNet((item && item.Net) ? item.Net : []),
            'rangePicker': new FormControl({ value: (item && item.rangePicker) ? this.getRangeDate(item.rangePicker) : '', disabled: false })
        });

        return newScreen2Form;
    }
    getRangeDate(item) {
        return [new Date(item[0]), new Date(item[1])];
    }

    createGuageChart(am4charts, am4core, outChart, inChart) {
        // this.spinner.show();
        this.inChartRendered = false;
        this.outChartRendered = false;
        inChart = am4core.create('in-chartdiv', am4charts.GaugeChart);
        inChart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        inChart.startAngle = 0;
        inChart.endAngle = 360;
        inChart.events.on('ready', () => {
            this.inChartRendered = true;
        });

        outChart = am4core.create('out-chartdiv', am4charts.GaugeChart);
        outChart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

        outChart.startAngle = 0;
        outChart.endAngle = 360;

        outChart.events.on('ready', () => {
            // this.spinner.hide();
            this.outChartRendered = true;
        });



        let startAngle = 0;

        const InTotalValue = this.InboundChart.reduce((sum, inc) => {
            const value = inc.Newforecastedrevenue > inc.Commitment ? inc.Newforecastedrevenue : inc.Commitment;
            return sum + value;
        }, 0);

        const colors = ['#0000ff', '#008000', '#9801f7'];
        this.InboundChart.forEach((inc, i) => {
            const value = inc.Newforecastedrevenue > inc.Commitment ? inc.Newforecastedrevenue : inc.Commitment;
            const endAngle = startAngle + ((value * 330) / InTotalValue) + 10;
            // console.log('startAngle', startAngle + 10);
            const inAxis = this.createAxis(am4charts, am4core, inChart, 0, value, startAngle + 10, endAngle,
                colors[i], inc.Commitment, InTotalValue);
            const inHand = this.createHand(am4charts, am4core, inChart, inAxis);
            inHand.showValue(inc.Commitment, 1000, am4core.ease.cubicOut);
            startAngle = endAngle;
            // console.log('endAngle', endAngle);
        });

        const outTotalValue = this.OutboundChart.reduce((sum, outc) => {
            const value = outc.ForecastedOutboundcost > outc.Commitment ? outc.ForecastedOutboundcost : outc.Commitment;
            return sum + value;
        }, 0);

        this.OutboundChart.forEach((outc, i) => {
            const value = outc.ForecastedOutboundcost > outc.Commitment ? outc.ForecastedOutboundcost : outc.Commitment;
            const endAngle = startAngle + ((value * 330) / outTotalValue) + 10;
            // console.log('startAngle', startAngle + 10);
            const outAxis = this.createAxis(am4charts, am4core, outChart, 0, value, startAngle + 10, endAngle,
                colors[i], outc.Commitment, outTotalValue);
            const outHand = this.createHand(am4charts, am4core, outChart, outAxis);
            outHand.showValue(outc.Commitment, 1000, am4core.ease.cubicOut);
            startAngle = endAngle;
            // console.log('endAngle', endAngle);
        });

        // setTimeout(() => {
        //   /** spinner ends after 5 seconds */
        //   this.spinner.hide();
        // }, 5000);
    }

    emptyList(list) {
        while (list.length) {
            list.pop();
        }
    }

    createXYChart(am4charts, am4core, outChart, inChart) {

        this.inChartRendered = false;
        this.outChartRendered = false;
        am4core.unuseAllThemes();
        if (!inChart) {
            inChart = am4core.create('in-chartdiv', am4charts.XYChart);
        } else {
            this.emptyList(inChart.xAxes);
            this.emptyList(inChart.yAxes);
            this.emptyList(inChart.series);
        }


        inChart.data = this.InboundChart;
        const inCategoryAxis = inChart.xAxes.push(new am4charts.CategoryAxis());
        inCategoryAxis.dataFields.category = 'Name';
        inCategoryAxis.renderer.grid.template.disabled = true;
        inCategoryAxis.renderer.labels.template.fontSize = 13;
        // inCategoryAxis.renderer.grid.disabled = true;
        inCategoryAxis.renderer.grid.template.location = 0;
        inCategoryAxis.renderer.minGridDistance = 30;
        inCategoryAxis.cursorTooltipEnabled = false;
        inChart.events.on('ready', () => {
            this.inChartRendered = true;
        });


        const inValueAxis = inChart.yAxes.push(new am4charts.ValueAxis());
        inValueAxis.renderer.grid.template.disabled = true;
        inValueAxis.title.text = '';
        inValueAxis.title.fontWeight = '500';
        inValueAxis.cursorTooltipEnabled = false;
        inValueAxis.min = 0;

        // Create series
        const inSeries = inChart.series.push(new am4charts.ColumnSeries());
        inSeries.dataFields.valueY = 'Newforecastedrevenue';
        inSeries.dataFields.categoryX = 'Name';
        inSeries.clustered = false;
        inSeries.columns.template.width = am4core.percent(90);
        inSeries.tooltipText = 'Newforecastedrevenue: [bold]{valueY}[/]';


        const inSeries2 = inChart.series.push(new am4charts.ColumnSeries());
        inSeries2.dataFields.valueY = 'Commitment';
        inSeries2.dataFields.categoryX = 'Name';
        inSeries2.clustered = false;
        inSeries2.columns.template.width = am4core.percent(60);
        inSeries2.columns.template.fill = am4core.color('#5F9EA0');
        inSeries2.tooltipText = 'Commitment: [bold]{valueY}[/]';

        const inSeries3 = inChart.series.push(new am4charts.ColumnSeries());
        inSeries3.dataFields.valueY = 'Variance';
        inSeries3.dataFields.categoryX = 'Name';
        inSeries3.clustered = false;
        inSeries3.columns.template.width = am4core.percent(30);

        inSeries3.tooltipText = `${this.varianceInbound}: [bold]{valueY}[/]`;

        inChart.cursor = new am4charts.XYCursor();
        inChart.cursor.lineX.disabled = true;
        inChart.cursor.lineY.disabled = true;

        if (!outChart) {
            outChart = am4core.create('out-chartdiv', am4charts.XYChart);
        } else {
            this.emptyList(outChart.xAxes);
            this.emptyList(outChart.yAxes);
            this.emptyList(outChart.series);
        }

        outChart.data = this.OutboundChart;
        const outCategoryAxis = outChart.xAxes.push(new am4charts.CategoryAxis());
        outCategoryAxis.renderer.grid.template.disabled = true;
        outCategoryAxis.renderer.labels.template.fontSize = 13;
        outCategoryAxis.dataFields.category = 'Name';
        outCategoryAxis.renderer.grid.template.location = 0;
        outCategoryAxis.cursorTooltipEnabled = false;
        outCategoryAxis.renderer.minGridDistance = 30;



        outChart.events.on('ready', () => {
            // this.spinner.hide();
            this.outChartRendered = true;
        });

        const valueAxis = outChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = '';
        valueAxis.title.fontWeight = '800';
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.min = 0;

        // Create series
        const series = outChart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = 'ForecastedOutboundcost';
        series.dataFields.categoryX = 'Name';
        series.clustered = false;
        series.columns.template.width = am4core.percent(90);
        series.tooltipText = 'ForecastedOutboundcost: [bold]{valueY}[/]';

        const series2 = outChart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = 'Commitment';
        series2.dataFields.categoryX = 'Name';
        series2.clustered = false;
        series2.columns.template.fill = am4core.color('#5F9EA0');
        series2.columns.template.width = am4core.percent(60);
        series2.tooltipText = 'Commitment: [bold]{valueY}[/]';

        const series3 = outChart.series.push(new am4charts.ColumnSeries());
        series3.dataFields.valueY = 'Variance';
        series3.dataFields.categoryX = 'Name';
        series3.clustered = false;
        series3.columns.template.width = am4core.percent(30);
        series3.tooltipText = `${this.varianceOutbound}: [bold]{valueY}[/]`;

        outChart.cursor = new am4charts.XYCursor();
        outChart.cursor.lineX.disabled = true;
        outChart.cursor.lineY.disabled = true;


    }

    createAxis(am4charts, am4core, chart, min, max, start, end, color, value, totalValue) {

        chart.legend = new am4charts.Legend();
        chart.legend.maxHeight = 150;
        chart.legend.scrollable = true;

        const axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        // axis.strictMinMax = true;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        // axis.renderer.minGridDistance = 100;
        axis.autoGridCount = false;
        axis.labelFrequency = 1000000;
        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = 10;
        axis.renderer.line.stroke = am4core.color(color);
        axis.renderer.ticks.template.stroke = am4core.color(color);
        axis.renderer.labels.template.disabled = true;

        const label0 = axis.axisRanges.create();
        label0.value = min;
        label0.label.text = this.numFmtr(min);
        label0.label.fontSize = 10;

        // const labeln = axis.axisRanges.create();
        // labeln.value = max;
        // labeln.label.text = this.numFmtr(max);
        // labeln.label.fontSize = 10;

        const gap = totalValue / 330;
        const grids = Math.round(max / gap);
        let value1 = 0;
        // const label0 = axis.axisRanges.create();
        // label0.value = value1 * 20;
        // label0.label.text = this.numFmtr(value1 * 20);
        // label0.label.fontSize = 10;
        for (let i = 0; i < grids; i++) {
            const labeln = axis.axisRanges.create();
            value1 += Math.round(gap);
            labeln.value = value1 * 20;
            // console.log(value1 * 20 + ' => ' + this.numFmtr(value1 * 20));
            labeln.label.text = this.numFmtr(value1 * 20);
            labeln.label.fontSize = 10;
        }

        axis.renderer.ticks.template.strokeOpacity = 1;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;

        return axis;
    }

    createHand(chart, axis, am4charts, am4core) {
        const hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 10;
        hand.endWidth = 0;
        hand.radius = am4core.percent(90);
        hand.innerRadius = am4core.percent(70);
        hand.value = 0;
        return hand;
    }

    screen3StaticData() {
        const data = '{"outboundDealType": { "current": "Flat Rate", "scenario1": "Flat Rate", "scenario2": "Flat Rate" }, "inboundDealType": { "current": "Flat Rate", "scenario1": "Flat Rate", "scenario2": "Flat Rate" }, "outboundTrafficSplit": { "current": "10", "scenario1": "40", "scenario2": "40" }, "inboundLastYearTraffic": { "current": null, "scenario1": "20", "scenario2": "20" }, "outboundCost": { "current": "494441", "scenario1": 4236580, "scenario2": 4236580 }, "inboundRevenue": { "current": "552800", "scenario1": 1779872, "scenario2": 1779872 }, "netPosition": { "current": 123588, "scenario1": -2236580, "scenario2": -2236580 }, "cNetPosition": { "current": -1659776, "scenario1": -8573007, "scenario2": -8573007 } }';
        return JSON.parse(data);
    }

    screen2StaticData() {
        const data = '{"Country":[{"ID":250,"Value":"France"}],"NetPosition":[{"ID":1,"Value":"Net Inbound"}],"OutBound":[{"ID":"1","OperatorName":"SFR","Group":"Altice","DealType":"Bal / Unbal","CurrentOutboundtrafficsplit":"75","CurrentDiscountperiodcost":"2522039","Forecastedcurrentperiod":"4203398","Updatedtrafficsplit":"40","ForecastedOutboundcost":"7562750","Voice":"0.1200","SMS":"0.5000","Data":"0.0150","Commitment":"6000000","LastAnalysis":"29/06/2020 11: 00"},{"ID":"2","OperatorName":"Orange France","Group":"Orange","DealType":"AYCE","CurrentOutboundtrafficsplit":"15","CurrentDiscountperiodcost":"1977765","Forecastedcurrentperiod":"3296275","Updatedtrafficsplit":"20","ForecastedOutboundcost":3800000,"Voice":"0.1048","SMS":"0.1048","Data":"0.0168","Commitment":"3800000","LastAnalysis":"28/05/2020 10:43"},{"ID":"3","OperatorName":"Dummy Operator","Group":"Dummy Group","DealType":"Flat Rate","CurrentOutboundtrafficsplit":"10","CurrentDiscountperiodcost":"494441","Forecastedcurrentperiod":"824069","Updatedtrafficsplit":"40","ForecastedOutboundcost":4236580,"Voice":"0.1000","SMS":"0.1000","Data":"0.0050","Commitment":"3000000","LastAnalysis":""}],"InBound":[{"ID":"1","OperatorName":"SFR","Group":"Altice","ScenarioName":"","DealType":"Bal / Unbal","CurrentDiscountperiodrevenue":"2807600","Scaleoflastyearstraffic":"10","Newforecastedrevenue":"4026323","Voice":"0.0200","SMS":"0.0500","Data":"0.0500","Forecastedcurrentperiodrevenue":"4813029","Commitment":"4000000"},{"ID":"2","OperatorName":"Orange France","Group":"Orange","ScenarioName":"","DealType":"AYCE","CurrentDiscountperiodrevenue":"541968","Scaleoflastyearstraffic":"30","Newforecastedrevenue":1000000,"Voice":"0.4258","SMS":"0.0426","Data":"0.0068","Forecastedcurrentperiodrevenue":"903280","Commitment":"1000000"},{"ID":"3","OperatorName":"Dummy Operator","Group":"Dummy Group","ScenarioName":"","DealType":"Flat Rate","CurrentDiscountperiodrevenue":"552800","Scaleoflastyearstraffic":"20","Newforecastedrevenue":1779872,"Voice":"0.1000","SMS":"0.4000","Data":"0.0190","Forecastedcurrentperiodrevenue":"947657","Commitment":"2000000"}],"Net":[{"ID":"1","OperatorName":"SFR","Group":"Altice","DealType":"Bal / Unbal","Forecastednetposition":-3536427,"ForecastedCurrentPeriodRevenue":609631,"IsEdit":false},{"ID":"2","OperatorName":"Orange France","Group":"Orange","DealType":"AYCE","Forecastednetposition":-2800000,"ForecastedCurrentPeriodRevenue":-2392995,"IsEdit":false},{"ID":"3","OperatorName":"Dummy Operator","Group":"Dummy Group","DealType":"Flat Rate","Forecastednetposition":-2236580,"ForecastedCurrentPeriodRevenue":123588,"IsEdit":true}]}';
        return JSON.parse(data);
    }

    bindVarianceType(newScreen2Form, ControlName, ArrayControlName, Value, UpdateControl = false) {
        if (UpdateControl) {
            newScreen2Form.get(ControlName).patchValue([{ 'ID': 1, 'Value': 'Budget' }]);
        }
        const ArrayControls = this.getArray(ArrayControlName, newScreen2Form);
        ArrayControls.controls.forEach(x => {
            x.get('VarianceTypeID').patchValue(Value);
        });
    }

    // #endregion
}
