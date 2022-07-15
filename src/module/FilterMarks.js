import Settings from '../Settings';
import Utils from '../Utils';

export default class FilterMarks {
    constructor() {
        this.id = 'FilterMarks';
        this.name = 'Filtermarkierung';
        this.description = 'Markiert Medien entsprechend ihres Filters.';

        this.displayLabelDetails = Settings.get('FilterMarks.settings.detail_filters');
        this.displayLabelStream = Settings.get('FilterMarks.settings.stream_filters');
        this.displayBenisStream = Settings.get('FilterMarks.settings.stream_benis');
    }


    static displayFilterLabel(itemData, $container) {
        let filter = FilterMarks.getFilter(itemData);
        let badge = document.createElement('span');
        badge.className = 'badge';
        badge.classList.toggle(filter);
        badge.innerText = filter.toUpperCase();

        $container.find('.item-details')[0].appendChild(badge);
    }


    static getFilter(itemData) {
        switch (itemData.flags) {
            case 1:
                return 'sfw';
            case 2:
                return 'nsfw';
            case 4:
                return 'nsfl';
            case 8:
                return 'nsfp';
        }
    }


    getSettings() {
        return [
            {
                id: 'stream_filters',
                title: 'Filter in Streams',
                description: 'Filterecken in Listen anzeigen?'
            },
            {
                id: 'detail_filters',
                title: 'Filter in Medienansicht',
                description: 'Filterlabel in der Detailansicht einblenden?'
            },
            {
                id: 'stream_benis',
                title: 'Benis beim Mouseover',
                description: 'Benis in der Übersicht einblenden?'
            }
        ];
    }


    load() {
        this.styles = require('../style/filterMarks.less');
        this.overrideViews();
    }


    overrideViews() {
        let _this = this;

        // Handle stream-view
        p.View.Stream.Main.prototype.buildItem = function (item) {
            const shouldShowPreview = !p.mobile && !!item.preview;
            return `
                <a class="silent thumb ${_this.displayLabelStream ? FilterMarks.getFilter(item) : ''}" ${shouldShowPreview ? `data-has-preview="true"` : ''} id="item-${item.id}" href="${this.baseURL + item.id}">
                    <img
                        width="128"
                        height="128"
                        onload="this.classList.add('loaded')"
                        onerror="this.parentElement.classList.add('error')"
                        src="${item.thumb}"
                    >
                    ${_this.displayBenisStream ? `
                    <span 
                        class="benis-info ${item.up - item.down > 0 ? 'up' : 'down'}">
                        ${item.up - item.down}
                    </span>` : ''}
                    ${shouldShowPreview ? `
                    <video
                        class="inline-preview-video"
                        preload="none"
                        loop
                        muted
                        width="128"
                        height="128"
                        src="${item.preview}"
                    >` : ''}
                    ${item.promoted > 1000000000 ? '<div class="sticky-badge"></div>' : ''}
                </a>
            `;
        };

        // Handle detail-view
        p.View.Stream.Item = p.View.Stream.Item.extend({
            show: function (rowIndex, itemData, defaultHeight, jumpToComment) {
                this.parent(rowIndex, itemData, defaultHeight, jumpToComment);

                if (_this.displayLabelDetails) {
                    FilterMarks.displayFilterLabel(itemData, this.$container);
                }
            }
        });

        // Fix audio-controls
        Utils.addVideoConstants();
    }
}
